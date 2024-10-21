import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            removeUser: jest.fn(),
            rateMovie: jest.fn(),
            addToWatchlist: jest.fn(),
            addToFavorites: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  describe('removeUser', () => {
    it('should remove a user successfully', async () => {
      const userId = 'validUserId';
      jest.spyOn(service, 'removeUser').mockResolvedValue(undefined);

      await expect(controller.removeUser({ userId })).resolves.toBeUndefined();
      expect(service.removeUser).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException if the user does not exist', async () => {
      const userId = 'invalidUserId';
      jest.spyOn(service, 'removeUser').mockRejectedValue(new NotFoundException());

      await expect(controller.removeUser({ userId })).rejects.toThrow(NotFoundException);
    });
  });

  describe('rateMovie', () => {
    it('should rate Movie successfully', async () => {
      jest.spyOn(service, 'rateMovie').mockResolvedValue(undefined);

      await expect(controller.rateMovie('validUserId', 'validMovieTitle', 6 )).resolves.toBeUndefined();
      expect(service.rateMovie).toHaveBeenCalledWith('validUserId', 'validMovieTitle', 6 );
    });

    it('should throw NotFoundException if the Movie does not exist', async () => {
      jest.spyOn(service, 'rateMovie').mockResolvedValue(undefined);

      await expect(controller.rateMovie('validUserId', 'invalidMovieTitle', 6 )).resolves.toBeUndefined();
      await expect(controller.rateMovie('validUserId', 'invalidMovieTitle', 6 )).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if the User does not exist', async () => {
      jest.spyOn(service, 'rateMovie').mockResolvedValue(undefined);

      await expect(controller.rateMovie('invalidUserId', 'validMovieTitle', 6 )).resolves.toBeUndefined();
      await expect(controller.rateMovie('invalidUserId', 'validMovieTitle', 6 )).rejects.toThrow(NotFoundException);
    });
  });

  describe('addToWatchlist', () => {
    it('should add Movie to watchlist successfully', async () => {
      jest.spyOn(service, 'addToWatchlist').mockResolvedValue(undefined);

      await expect(controller.addToWatchlist('validUserId', 'validMovieTitle')).resolves.toBeUndefined();
      expect(service.addToWatchlist).toHaveBeenCalledWith('validUserId', 'validMovieTitle');
    });

    it('should throw NotFoundException if the Movie does not exist', async () => {
      jest.spyOn(service, 'addToWatchlist').mockResolvedValue(undefined);

      await expect(controller.addToWatchlist('validUserId', 'invalidMovieTitle')).resolves.toBeUndefined();
      await expect(controller.addToWatchlist('validUserId', 'invalidMovieTitle')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if the User does not exist', async () => {
      jest.spyOn(service, 'addToWatchlist').mockResolvedValue(undefined);

      await expect(controller.addToWatchlist('invalidUserId', 'validMovieTitle')).resolves.toBeUndefined();
      await expect(controller.addToWatchlist('invalidUserId', 'validMovieTitle')).rejects.toThrow(NotFoundException);
    });
  });

  describe('addToFavorites', () => {
    it('should add Movie to Favorites successfully', async () => {
      jest.spyOn(service, 'addToFavorites').mockResolvedValue(undefined);

      await expect(controller.addToFavorites('validUserId', 'validMovieTitle')).resolves.toBeUndefined();
      expect(service.addToFavorites).toHaveBeenCalledWith('validUserId', 'validMovieTitle');
    });

    it('should throw NotFoundException if the Movie does not exist', async () => {
      jest.spyOn(service, 'addToFavorites').mockResolvedValue(undefined);

      await expect(controller.addToFavorites('validUserId', 'invalidMovieTitle')).resolves.toBeUndefined();
      await expect(controller.addToFavorites('validUserId', 'invalidMovieTitle')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if the User does not exist', async () => {
      jest.spyOn(service, 'addToFavorites').mockResolvedValue(undefined);

      await expect(controller.addToFavorites('invalidUserId', 'validMovieTitle')).resolves.toBeUndefined();
      await expect(controller.addToFavorites('invalidUserId', 'validMovieTitle')).rejects.toThrow(NotFoundException);
    });
  });

});