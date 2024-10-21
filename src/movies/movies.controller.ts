import { Controller, Get, Query, Delete } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { GetMoviesDto } from './dto/get-movies.dto';
import { SearchMoviesDto } from './dto/search-movies.dto';
import { FilterMovieByGenreNameDto } from './dto/filter-movie-by-genre-name.dto';
import { RemoveMovieDto } from './dto/remove-movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('fetch-and-store')
  async fetchAndStoreMovies() {
    const movies = await this.moviesService.fetchMoviesFromTMDB();
    if (movies.length > 0) {
      await this.moviesService.storeMovies(movies);
      return { message: 'Movies fetched and stored successfully!' };
    } else {
      return { message: 'Failed to fetch movies from TMDB' };
    }
  }

    // List movies with pagination and optional filtering
  @Get()
  async getMovies(@Query() query: GetMoviesDto) {
    const { page, limit, release_date, adult, average_rating } = query;
    const filter: any = {};

    if (release_date) filter.release_date = release_date;
    if (adult) filter.adult = adult;
    if (average_rating) filter.average_rating = { $gte: average_rating };

    const movies = await this.moviesService.getMovies(page, limit, filter);
    const totalMovies = await this.moviesService.getMoviesCount(filter);

    return {
      data: movies,
      meta: {
        totalMovies,
        page,
        limit,
        totalPages: Math.ceil(totalMovies / limit),
      },
    };
  }

  // Search movies by title
  @Get('search')
  async searchMovies(@Query() query: SearchMoviesDto) {
    const { title, page, limit } = query;
    const movies = await this.moviesService.searchMoviesByTitle(title, page, limit);
    const totalMovies = await this.moviesService.getMoviesCount({ title: { $regex: title, $options: 'i' } });

    return {
      data: movies,
      meta: {
        totalMovies,
        page,
        limit,
        totalPages: Math.ceil(totalMovies / limit),
      },
    };
  }

  // Endpoint to filter movies by genre name
  @Get('filter-by-genre-name')
  async filterMoviesByGenreName(@Query() filterMovieByGenreNameDto: FilterMovieByGenreNameDto) {
    const { genreName } = filterMovieByGenreNameDto;
    return this.moviesService.filterMoviesByGenreName(genreName);
  }

  @Delete('delete-movie')
  async removeMovie(@Query() query: RemoveMovieDto) {
    const { movieId } = query;
    await this.moviesService.removeMovie(movieId);
  }
}