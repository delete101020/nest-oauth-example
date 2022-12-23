import { ProjectService } from '@modules/project/project.service';
import { compare, genSalt, hash } from 'bcryptjs';
import { SignOptions, sign, verify } from 'jsonwebtoken';
import { EnvironmentVariables } from '@config/index';
import { Project } from '@modules/project/models';
import { UserDto } from '@modules/user/dtos';
import { TokenAccess } from '@modules/user/enums';
import { User } from '@modules/user/models';
import { UserService } from '@modules/user/user.service';
import {
  Inject,
  Injectable,
  forwardRef,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuthTokenPayload, AccessTokenPayload } from './payloads';
import { GenerateOAuthCodeDto } from './dtos';

export const ACCESS_TOKEN = 'access';

@Injectable()
export class AuthService {
  private readonly jwtOptions: { [ACCESS_TOKEN]: SignOptions };
  private readonly jwtKeys: { [ACCESS_TOKEN]: string };

  constructor(
    private readonly _configService: ConfigService,
    @Inject(forwardRef(() => UserService))
    private readonly _userService: UserService,
    private readonly _projectService: ProjectService,
  ) {
    this.jwtKeys = {
      [ACCESS_TOKEN]: this._configService.get<string>(
        EnvironmentVariables.JWT_SECRET,
      ),
    };
    this.jwtOptions = {
      [ACCESS_TOKEN]: {
        expiresIn: this._configService.get<string>(
          EnvironmentVariables.JWT_EXPIRES_IN,
        ),
      },
    };
  }

  async register(data: UserDto) {
    const user = await this._userService.createFromRequestBody(data);

    return this.generateAuthToken(user);
  }

  async login(user: User) {
    return this.generateAuthToken(user);
  }

  async logout(token: string) {
    const user = await this._userService.getOneBy({
      'tokens.token': token,
      'tokens.access': TokenAccess.AUTH,
    });
    if (!user) return;

    user.tokens = user.tokens.filter((t) => t.token !== token);
    await user.save();
  }

  /** ========== GENERATE TOKEN ========== */
  async generateAuthToken(user: User) {
    const { _id: userId, email, phone } = user.toJSON();

    const token = this.signPayload({
      userId,
      email,
      phone,
      access: TokenAccess.AUTH,
    });

    return { token };
  }

  async generateOAuthCode({
    ownerId,
    projectId,
    redirectUrl,
    scope,
  }: GenerateOAuthCodeDto) {
    const [user, project] = await Promise.all([
      this._userService.getOne(ownerId),
      this._projectService.getOneBy({
        projectId,
        createdBy: ownerId,
      }),
    ]);

    if (!user || !project) throw new ForbiddenException();

    const { scope: projectScope, redirectUrls } = project.toJSON();
    if (scope !== projectScope) throw new BadRequestException('Invalid scope');
    if (!redirectUrls.includes(redirectUrl))
      throw new BadRequestException('Invalid redirect url');

    const token = this.signPayload({
      userId: ownerId,
      projectId,
      scope,
      access: TokenAccess.OAUTH,
    });

    user.tokens.push({ token, access: TokenAccess.OAUTH });
    await user.save();

    return { token };
  }

  async generateAccessToken(user: User, project: Project) {
    const { _id: userId } = user.toJSON();
    const { scope } = project.toJSON();

    const token = this.signPayload({
      userId,
      scope,
      access: TokenAccess.ACCESS,
    });

    user.tokens.push({ token, access: TokenAccess.ACCESS });
  }
  /** ========== GENERATE TOKEN ========== */

  /** ========== VERIFY TOKEN ========== */
  async verifyOAuthCode(token: string) {
    const decoded = this.verifyToken(
      token,
      TokenAccess.OAUTH,
    ) as OAuthTokenPayload;
    if (!decoded) return null;

    const { userId, projectId } = decoded;
    const [user, project] = await Promise.all([
      this._userService.getOne(userId),
      this._projectService.getOneBy({
        _id: projectId,
        createdby: userId,
      }),
    ]);

    if (!user) throw new ForbiddenException('Invalid token');
    if (!project)
      throw new BadRequestException('The token does not belong to the project');

    return { user, project };
  }

  async verifyAccessToken(token: string) {
    const decoded = this.verifyToken(
      token,
      TokenAccess.ACCESS,
    ) as AccessTokenPayload;
    if (!decoded) return null;

    const { userId, scope } = decoded;
    const user = await this._userService.getOne(userId);

    if (!user) throw new ForbiddenException('Invalid token');

    return { user, scope };
  }

  /** ========== VERIFY TOKEN ========== */

  /** ========== LOGIN VALIDATION ========== */
  async validateUser(
    identifier: string,
    password: string,
  ): Promise<User | null> {
    const user = await this._userService.getOne(identifier, 'email');
    if (user && (await this.comparePassword(password, user.password))) {
      return user;
    }
    return null;
  }
  /** ========== LOGIN VALIDATION ========== */

  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(10);
    return hash(password, salt);
  }

  async comparePassword(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    return compare(password, hashPassword);
  }

  signPayload(payload: any, type: string = ACCESS_TOKEN): string {
    return sign(payload, this.jwtKeys[type], this.jwtOptions[type]);
  }

  verifyToken(token: string, type: string = ACCESS_TOKEN) {
    return verify(token, this.jwtKeys[type]);
  }
}
