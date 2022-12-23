import { Document } from 'mongoose';
import { BaseModel } from '@common/models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Token, TokenSchema } from './token.model';

export const USER_MODEL = 'User';
export type UserDocument = User & Document;

@Schema()
export class User extends BaseModel {
  _id: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop()
  phone: string;

  @Prop()
  password: string;

  @Prop({ type: [TokenSchema], default: [] })
  tokens: Token[];
}

export const UserSchema = SchemaFactory.createForClass(User);
