import { Model } from 'mongoose';
import { BaseService } from '@common/models';
import { AuthService } from '@modules/auth/auth.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDto } from './dtos';
import { USER_MODEL, User } from './models';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectModel(USER_MODEL) private readonly _userModel: Model<User>,
    private readonly _authService: AuthService,
  ) {
    super(_userModel);
  }
  async createFromRequestBody(data: UserDto) {
    const { email, password } = data;

    // Check if user already exists
    const user = await this.getOne(email, 'email');
    if (user) throw new BadRequestException('User already exists');

    // Create new user
    const newUser = await this.createFromRequestBody({
      ...data,
      password: await this._authService.hashPassword(password),
    });
    return newUser;
  }
}
