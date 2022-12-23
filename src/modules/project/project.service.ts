import { ConfigService } from '@nestjs/config';
import { BaseService } from '@common/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { generateSlug } from '@common/utils';
import { CreateProjectDto } from './dtos';
import { Project, PROJECT_MODEL } from './models';
import { createHmac } from 'crypto';
import { EnvironmentVariables } from '@config/index';

@Injectable()
export class ProjectService extends BaseService<Project> {
  constructor(
    @InjectModel(PROJECT_MODEL) private readonly _projectModel: Model<Project>,
    private readonly _configService: ConfigService,
  ) {
    super(_projectModel);
  }

  async createFromRequestBody(data: CreateProjectDto) {
    const { name, scope, redirectUrls, createdBy } = data;

    const projectId = generateSlug(name) + '.myapp.in';
    const secret = createHmac(
      'sha256',
      this._configService.get<string>(EnvironmentVariables.SECRET),
    )
      .update(projectId)
      .digest('hex');

    const project = new Project({
      projectId,
      secret,
      name,
      redirectUrls,
      scope,
      createdBy,
    });
    await project.save();

    return project;
  }

  async addRedirectUrl(
    projectId: string,
    ownerId: string,
    redirectUrl: string,
  ) {
    const project = await this.getOneBy({ id: projectId, createdBy: ownerId });
    if (!project) throw new Error('Project not found');

    project.redirectUrls.push(redirectUrl);
    await project.save();

    return project;
  }
}
