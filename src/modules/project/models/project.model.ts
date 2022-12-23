import { Document } from 'mongoose';
import { BaseModel } from '@common/models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProjectScope } from '../enums';

export const PROJECT_MODEL = 'Project';
export type ProjectDocument = Project & Document;

@Schema()
export class Project extends BaseModel {
  _id: string;

  @Prop({ required: true, unique: true })
  projectId: string;

  @Prop()
  secret: string;

  @Prop()
  name: string;

  @Prop()
  redirectUrls: string[];

  @Prop({ enum: ProjectScope, default: ProjectScope.DEFAULT })
  scope: string;

  @Prop()
  createdBy: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
