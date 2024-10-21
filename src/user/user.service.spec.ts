import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';

describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            deleteOne: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  describe('removeUser', () => {
    it('should delete a User successfully', async () => {
      const UserId = 'validUserId';
      jest.spyOn(model, 'deleteOne').mockResolvedValueOnce({ deletedCount: 1 } as any);

      await expect(service.removeUser(UserId)).resolves.toBeUndefined();
      expect(model.deleteOne).toHaveBeenCalledWith({ _id: UserId });
    });

    it('should throw NotFoundException if the User is not found', async () => {
      const UserId = 'invalidUserId';
      jest.spyOn(model, 'deleteOne').mockResolvedValueOnce({ deletedCount: 0 } as any);

      await expect(service.removeUser(UserId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('rateMovie', () => {
    it('should delete a User successfully', async () => {
      const UserId = 'validUserId';
      jest.spyOn(model, 'deleteOne').mockResolvedValueOnce({ deletedCount: 1 } as any);

      await expect(service.removeUser(UserId)).resolves.toBeUndefined();
      expect(model.deleteOne).toHaveBeenCalledWith({ _id: UserId });
    });

    it('should throw NotFoundException if the User is not found', async () => {
      const UserId = 'invalidUserId';
      jest.spyOn(model, 'deleteOne').mockResolvedValueOnce({ deletedCount: 0 } as any);

      await expect(service.removeUser(UserId)).rejects.toThrow(NotFoundException);
    });
  });

});
