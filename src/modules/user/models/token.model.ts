import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export const TOKEN_MODEL = 'Token';
export type TokenDocument = Token & Document;

@Schema({ _id: false, timestamps: false })
export class Token {
  @Prop({ required: true })
  access: string;

  @Prop({ required: true })
  token: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
