import { Injectable, NotFoundException  } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from '../schemas/movie.schema';
import { Genre, GenreDocument } from '../schemas/genre.schema';
import axios from 'axios';

@Injectable()
export class MoviesService {
  constructor(@InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
  @InjectModel(Genre.name) private genreModel: Model<GenreDocument>,) {}

  async fetchMoviesFromTMDB(): Promise<any[]> {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}`);
      return response.data.results;
    } catch (error) {
      console.error('Error fetching data from TMDB:', error);
      return [];
    }
  }

  async storeMovies(movies: any[]): Promise<void> {
    try {
      const result = await this.movieModel.insertMany(movies.map(movie => ({
        title: movie.title,
        overview: movie.overview,
        release_date: movie.release_date,
        genre_ids: movie.genre_ids,
        average_rating: movie.vote_average,
      })));
      console.log(`${result.length} movies inserted into MongoDB`);
    } catch (error) {
      console.error('Error storing data in MongoDB:', error);
    }
  }

   // Fetch movies with pagination and optional filters
   async getMovies(page: number, limit: number, filter: any): Promise<Movie[]> {
    const skip = (page - 1) * limit;
    return await this.movieModel.find(filter).skip(skip).limit(limit).exec();
  }

  // Get movie count (for pagination metadata)
  async getMoviesCount(filter: any): Promise<number> {
    return await this.movieModel.countDocuments(filter).exec();
  }

  // Search movies by title
  async searchMoviesByTitle(title: string, page: number, limit: number): Promise<Movie[]> {
    const skip = (page - 1) * limit;
    return await this.movieModel.find({ title: { $regex: title, $options: 'i' } })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  // Find a movie by title
  async findMovieByTitle(title: string): Promise<Movie> {
    const movie = await this.movieModel.findOne({ title }).exec();
    if (!movie) {
      throw new NotFoundException(`Movie with title "${title}" not found`);
    }
    return movie;
  }

  // Method to filter movies by genre name
  async filterMoviesByGenreName(genreName: string): Promise<Movie[]> {
    // Find the genre by its name
    const genre = await this.genreModel.findOne({ name: genreName }).exec();
    if (!genre) {
      throw new NotFoundException(`Genre with name ${genreName} not found`);
    }

    // Use the found genre ID to filter movies
    const genreId = genre.id;  // Assuming genreId is stored in the Genre schema

    const movies = await this.movieModel.find({ genreIds: genreId }).exec();
    return movies;
  }

   // Method to remove a movie by its ID
   async removeMovie(movieId: string): Promise<void> {
    const result = await this.movieModel.deleteOne({ _id: movieId }).exec();
    
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Movie with ID ${movieId} not found`);
    }
  }
}