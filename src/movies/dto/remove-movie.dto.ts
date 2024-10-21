import { IsMongoId } from 'class-validator';

export class RemoveMovieDto {
  @IsMongoId()
  movieId: string;  // The genre name to filter by, e.g., "Action"
}