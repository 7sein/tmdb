import { Controller, Post, Body, Param, Patch, Put, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RemoveUserDto } from './dto/remove-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Create a new user
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // Update user (username, email, watchlist, favorites, ratings)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  // Add movie to watchlist
  @Put(':id/watchlist/:movieTitle')
  async addToWatchlist(@Param('id') userId: string, @Param('movieTitle') movieTitle: string) {
    return this.userService.addToWatchlist(userId, movieTitle);
  }

  // Add movie to favorites
  @Put(':id/favorites/:movieTitle')
  async addToFavorites(@Param('id') userId: string, @Param('movieTitle') movieTitle: string) {
    return this.userService.addToFavorites(userId, movieTitle);
  }

  // Rate a movie
  @Put(':id/rate/:movieTitle')
  async rateMovie(
    @Param('id') userId: string,
    @Param('movieTitle') movieTitle: string,
    @Body('userRating') userRating: number
  ) {
    return this.userService.rateMovie(userId, movieTitle, userRating);
  }

  @Delete('delete-user')
  async removeUser(@Query() query: RemoveUserDto) {
    const { userId } = query;
    await this.userService.removeUser(userId);
  }
}