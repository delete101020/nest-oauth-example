import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PROJECT_MODEL, ProjectSchema } from './models/project.model';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PROJECT_MODEL, schema: ProjectSchema }]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
