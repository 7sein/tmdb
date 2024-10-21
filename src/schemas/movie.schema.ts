import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema()
export class Movie {
  @Prop({ type: Types.ObjectId })  // Explicitly declare _id as ObjectId
  _id: Types.ObjectId;

  @Prop()
  title: string;

  @Prop()
  overview: string;

  @Prop()
  release_date: string;

  @Prop({ type: [Number], required: true })  // Array of genre IDs from TMDB
  genre_ids: number[];  // TMDB genre IDs

  @Prop()
  adult: Boolean;

  @Prop()
  average_rating: number;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
