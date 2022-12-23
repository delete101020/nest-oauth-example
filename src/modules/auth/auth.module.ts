import { UserModule } from '@modules/user/user.module';
import { Module, forwardRef } from '@nestjs/common';
import { ProjectModule } from './../project/project.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy, LocalStrategy } from './strategies';

@Module({
  imports: [forwardRef(() => UserModule), ProjectModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
