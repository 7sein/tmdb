import { IsString, IsEmail, IsArray, IsOptional, ArrayNotEmpty, IsNumber, Min, Max } from 'class-validator';
import { Types } from 'mongoose';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsArray()
  watchlist?: Types.ObjectId[];  // Optional array of movie IDs

  @IsOptional()
  @IsArray()
  favorites?: Types.ObjectId[];  // Optional array of favorite movie IDs

  @IsOptional()
  @IsArray()
  ratings?: { movieId: Types.ObjectId; userRating: number }[];  // Optional array of rating objects
}
