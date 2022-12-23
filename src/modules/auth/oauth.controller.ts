import { User } from '@modules/user/models';
import { AuthService } from '@modules/auth/auth.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryParam, RequestUser } from '@common/decorators';
import { ProjectScope } from '../project/enums';
import { JwtAuthGuard } from './guards';
import { SCOPE_MAPPING } from '@modules/project/constants';

@Controller('oauth')
export class OAuthController {
  constructor(private readonly _authService: AuthService) {}

  /**
   * Generate OAuth code, which will be used to generate access token
   * @param {string} query.projectId Project ID
   * @param {string} query.scope Scope
   * @param {string} query.redirectUrl Redirect URL
   * @returns OAuth code
   */

  @UseGuards(JwtAuthGuard)
  @Get('code')
  async getAuthorizationCode(
    @RequestUser() user: User,
    @QueryParam()
    query: {
      projectId: string;
      scope: ProjectScope;
      redirectUrl: string;
    },
  ) {
    const { projectId, redirectUrl, scope } = query;
    return this._authService.generateOAuthCode({
      ownerId: user.id,
      projectId,
      redirectUrl,
      scope,
    });
  }

  /**
   * Exchange OAuth code for access token
   * @param code OAuth code
   * @returns Access token
   */
  @Get('token')
  async getAccessToken(
    @QueryParam('code') code: string, // OAuth code
  ) {
    const { user, project } = await this._authService.verifyOAuthCode(code);
    return this._authService.generateAccessToken(user, project);
  }

  /**
   * Get user info with access token
   * @param code Access token
   * @returns User info
   */
  async getUserInfo(@QueryParam('code') code: string) {
    const { user, scope } = await this._authService.verifyAccessToken(code);

    const scopeMapping = SCOPE_MAPPING[scope];
    const userInfo = {};

    Object.keys(user).forEach((key) => {
      if (scopeMapping.includes(key)) {
        userInfo[key] = user[key];
      }
    });

    return userInfo;
  }
}
