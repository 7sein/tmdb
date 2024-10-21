import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { NotFoundException } from '@nestjs/common';
import * as mongoose from 'mongoose';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: {
            removeMovie: jest.fn(),
            filterMoviesByGenreName: jest.fn(),
            searchMovies: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  describe('removeMovie', () => {
    it('should remove a movie successfully', async () => {
      const movieId = 'validMovieId';
      jest.spyOn(service, 'removeMovie').mockResolvedValue(undefined);

      await expect(controller.removeMovie({ movieId })).resolves.toBeUndefined();
      expect(service.removeMovie).toHaveBeenCalledWith(movieId);
    });

    it('should throw NotFoundException if the movie does not exist', async () => {
      const movieId = 'invalidMovieId';
      jest.spyOn(service, 'removeMovie').mockRejectedValue(new NotFoundException());

      await expect(controller.removeMovie({ movieId })).rejects.toThrow(NotFoundException);
    });
  });

  describe('Filtering by Genre', () => {
    it('should return filtered movies by genre name', async () => {
      const genreName = 'action';
      const filteredMovies = [{ _id: new mongoose.Types.ObjectId(), title: 'Movie1', overview: 'Movie1', release_date:'2024-10-20', genre_ids: [1 , 2], adult: true, average_rating: 6}, { _id: new mongoose.Types.ObjectId(), title: 'Movie2', overview: 'Movie2', release_date:'2024-10-20', genre_ids: [3 , 4], adult: false, average_rating: 8}];
      jest.spyOn(service, 'filterMoviesByGenreName').mockResolvedValue(filteredMovies);
  
      const result = await controller.filterMoviesByGenreName({ genreName: genreName });
      expect(result).toEqual(filteredMovies);
      expect(service.filterMoviesByGenreName).toHaveBeenCalledWith(genreName);
    });
  });

  describe('Search movies by title', () => {
    it('should return movies by title', async () => {
      const title = 'movie';
      const mockedMovies = [{ _id: new mongoose.Types.ObjectId(), title: 'movie1', overview: 'Movie1', release_date:'2024-10-20', genre_ids: [1 , 2], adult: true, average_rating: 6}, { _id: new mongoose.Types.ObjectId(), title: 'movie2', overview: 'Movie2', release_date:'2024-10-20', genre_ids: [3 , 4], adult: false, average_rating: 8}];
      jest.spyOn(service, 'searchMoviesByTitle').mockResolvedValue(mockedMovies);
  
      const result = await controller.searchMovies({ title: title });
      expect(result).toEqual(mockedMovies);
      expect(service.searchMoviesByTitle).toHaveBeenCalledWith(title);
    });
  });
});