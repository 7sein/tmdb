import { IsOptional, IsString, IsNumber, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetMoviesDto {
  @IsOptional()
  @Type(() => Number)  // Transform query parameter to number
  @IsNumber()
  @Min(1)
  page?: number = 1;  // Default page value
  
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  limit?: number = 10;  // Default limit value
  
  @IsOptional()
  @IsString()
  release_date?: string;  // Optional filter for release date
  
  @IsOptional()
  @Type(() => Boolean)
  @IsNumber()
  @Min(0)
  adult?: Boolean;  // Optional filter for popularity
  
  @IsOptional()
  genreIds?: number[];  // Array of TMDB genre IDs

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  average_rating?: number;  // Optional filter for vote average
}