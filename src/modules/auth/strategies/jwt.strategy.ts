import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvironmentVariables } from '@config/index';
import { UserService } from '@modules/user/user.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService, private _userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(EnvironmentVariables.JWT_SECRET),
    });
  }

  async validate(payload: any) {
    const { _id } = payload;
    const user = await this._userService.getOneBy(_id);

    return user.toJSON();
  }
}
