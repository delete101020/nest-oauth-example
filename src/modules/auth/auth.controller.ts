import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Post,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { RequestUser } from '@common/decorators';
import { UserDto } from '@modules/user/dtos';
import { User } from '@modules/user/models';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private _authService: AuthService) {}

  @Post('register')
  async register(@Body() data: UserDto) {
    return this._authService.register(data);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@RequestUser() user: User) {
    return this._authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('logout')
  async logout(@Headers('Authorization') token: string) {
    return this._authService.logout(token);
  }
}
