import { JwtAuthGuard } from '@modules/auth/guards';
import { User } from '@modules/user/models';
import { AddRedirectUrlDto, CreateProjectDto } from './dtos';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { RequestUser } from '@common/decorators';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectController {
  constructor(private readonly _projectService: ProjectService) {}

  @Post()
  async create(@Body() data: CreateProjectDto) {
    return this._projectService.createFromRequestBody(data);
  }

  @Get()
  async get(@RequestUser() user: User) {
    return this._projectService.get({ createdBy: user._id });
  }

  @Post(':projectId/redirect-urls')
  async addRedirectUrl(
    @RequestUser() user: User,
    @Param('projectId') projectId: string,
    @Body() data: AddRedirectUrlDto,
  ) {
    const { redirectUrl } = data;

    return this._projectService.addRedirectUrl(projectId, user.id, redirectUrl);
  }

  @Delete(':projectId')
  async delete(
    @RequestUser() user: User,
    @Param('projectId') projectId: string,
  ) {
    return this._projectService.delete({ createdBy: user._id, projectId });
  }
}
