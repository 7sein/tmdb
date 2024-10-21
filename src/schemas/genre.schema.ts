import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GenreDocument = Genre & Document;

@Schema()
export class Genre {
  @Prop({ required: true, unique: true })
  id: number;  // TMDB genre ID

  @Prop({ required: true })
  name: string;  // Genre name
}

export const GenreSchema = SchemaFactory.createForClass(Genre);