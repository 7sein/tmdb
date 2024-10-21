import { IsString } from 'class-validator';

export class FilterMovieByGenreNameDto {
  @IsString()
  genreName: string;  // The genre name to filter by, e.g., "Action"
}