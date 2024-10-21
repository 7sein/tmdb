import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { MoviesService } from '../movies/movies.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
  private readonly moviesService: MoviesService) {}
  // Create a new user
  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  // Find a user by ID
  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Update user (watchlist, favorites, ratings)
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

   // Add movie to watchlist by movie title
   async addToWatchlist(userId: string, movieTitle: string): Promise<User> {
    const movie = await this.moviesService.findMovieByTitle(movieTitle);
    if (!movie) {
      throw new NotFoundException(`Movie with title "${movieTitle}" not found`);
    }

    const user = await this.userModel.findById(userId);
    if (!user.watchlist.includes(movie._id)) {
      user.watchlist.push(movie._id);
    }

    return user.save();
  }

  // Add movie to favorites
  async addToFavorites(userId: string, movieTitle: string): Promise<User> {
    // Step 1: Find the movie by title
    const movie = await this.moviesService.findMovieByTitle(movieTitle);
    if (!movie) {
      throw new NotFoundException(`Movie with title "${movieTitle}" not found`);
    }

    // Step 2: Add movieId to user's favorites
    const user = await this.userModel.findById(userId);
    if (!user.favorites.includes(movie._id)) {
      user.favorites.push(movie._id);
    }
    return user.save();
  }

  // Add or update rating for a movie
  async rateMovie(userId: string, movieTitle: string, userRating: number): Promise<User> {
    const user = await this.userModel.findById(userId);
    
    // Step 1: Find the movie by title
    const movie = await this.moviesService.findMovieByTitle(movieTitle);
    if (!movie) {
      throw new NotFoundException(`Movie with title "${movieTitle}" not found`);
    }

    const ratingIndex = user.ratings.findIndex(rating => rating.movieId.toString() === movie._id.toString());
    
    if (ratingIndex === -1) {
      user.ratings.push({ movieId: movie._id, userRating });
    } else {
      user.ratings[ratingIndex].userRating = userRating;
    }

    return user.save();
  }

   // Method to remove a user by their ID
   async removeUser(userId: string): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: userId }).exec();
    
    if (result.deletedCount === 0) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  }
}