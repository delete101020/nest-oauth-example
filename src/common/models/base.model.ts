import { Document, SchemaOptions } from 'mongoose';
import { Prop } from '@nestjs/mongoose';

export const schemaOptions: SchemaOptions = {
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
  toJSON: {
    virtuals: true,
    getters: true,
  },
};

export class BaseModel extends Document {
  @Prop({ default: new Date() })
  createdAt?: Date;

  @Prop({ default: new Date() })
  updatedAt?: Date;
}
