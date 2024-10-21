import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: [Types.ObjectId], ref: 'Movie', default: [] })
  watchlist: Types.ObjectId[];  // Array of movie IDs

  @Prop({ type: [Types.ObjectId], ref: 'Movie', default: [] })
  favorites: Types.ObjectId[];  // Array of favorite movie IDs

  @Prop({
    type: [
      {
        movieId: { type: Types.ObjectId, ref: 'Movie' },
        userRating: { type: Number, min: 0, max: 10 },  // Rating between 0 and 10
      },
    ],
    default: [],
  })
  ratings: { movieId: Types.ObjectId; userRating: number }[];  // Array of rating objects
}

export const UserSchema = SchemaFactory.createForClass(User);