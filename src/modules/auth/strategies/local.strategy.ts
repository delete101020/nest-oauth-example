import { Strategy } from 'passport-local';
import { User } from '@modules/user/models';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private _authService: AuthService) {
    super({ usernameField: 'identifier', passwordField: 'password' });
  }

  async validate(identifier: string, password: string): Promise<User> {
    const user = await this._authService.validateUser(identifier, password);
    if (!user) throw new UnauthorizedException();

    return user;
  }
}
