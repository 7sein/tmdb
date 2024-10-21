import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Movie } from '../schemas/movie.schema';
import * as mongoose from 'mongoose';

describe('MoviesService', () => {
  let service: MoviesService;
  let model: Model<Movie>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getModelToken(Movie.name),
          useValue: {
            deleteOne: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    model = module.get<Model<Movie>>(getModelToken(Movie.name));
  });

  describe('removeMovie', () => {
    it('should delete a movie successfully', async () => {
      const movieId = 'validMovieId';
      jest.spyOn(model, 'deleteOne').mockResolvedValueOnce({ deletedCount: 1 } as any);

      await expect(service.removeMovie(movieId)).resolves.toBeUndefined();
      expect(model.deleteOne).toHaveBeenCalledWith({ _id: movieId });
    });

    it('should throw NotFoundException if the movie is not found', async () => {
      const movieId = 'invalidMovieId';
      jest.spyOn(model, 'deleteOne').mockResolvedValueOnce({ deletedCount: 0 } as any);

      await expect(service.removeMovie(movieId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('filterMoviesByGenreName', () => {
    it('should return movies filtered by genre name', async () => {
      const genreName = 'action';
      const filteredMovies: Movie[] = [{ _id: new mongoose.Types.ObjectId(), title: 'Movie1', overview: 'Movie1', release_date:'2024-10-20', genre_ids: [1 , 2], adult: true, average_rating: 6}, { _id: new mongoose.Types.ObjectId(), title: 'Movie2', overview: 'Movie2', release_date:'2024-10-20', genre_ids: [3 , 4], adult: false, average_rating: 8}];
      jest.spyOn(model, 'find').mockResolvedValue(filteredMovies);

      const result = await service.filterMoviesByGenreName(genreName);
      expect(result).toEqual(filteredMovies);
      expect(model.find).toHaveBeenCalled();
    });
  });

  describe('searchMoviesByTitle', () => {
    it('should return movies by title', async () => {
      const title = 'movie';
      const mockedMovies = [{ _id: new mongoose.Types.ObjectId(), title: 'movie1', overview: 'Movie1', release_date:'2024-10-20', genre_ids: [1 , 2], adult: true, average_rating: 6}, { _id: new mongoose.Types.ObjectId(), title: 'movie2', overview: 'Movie2', release_date:'2024-10-20', genre_ids: [3 , 4], adult: false, average_rating: 8}];
      jest.spyOn(model, 'find').mockResolvedValue(mockedMovies);

      const result = await service.searchMoviesByTitle(title, 1, 10);
      expect(result).toEqual(mockedMovies);
      expect(model.find).toHaveBeenCalled();
    });
  });

});