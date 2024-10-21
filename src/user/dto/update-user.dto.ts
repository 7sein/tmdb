import { IsString, IsArray, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsArray()
  watchlist?: Types.ObjectId[];

  @IsOptional()
  @IsArray()
  favorites?: Types.ObjectId[];

  @IsOptional()
  @IsArray()
  ratings?: { movieId: Types.ObjectId; userRating: number }[];
}
