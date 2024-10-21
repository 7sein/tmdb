import { Controller, Get, Post, Query  } from '@nestjs/common';
import { GenresService } from './genre.service';

@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  // Endpoint to sync genres with TMDB and store in MongoDB
  @Post('sync')
  async syncGenres() {
    await this.genresService.syncGenres();
    return { message: 'Genres synced with TMDB and saved in MongoDB' };
  }

  // Endpoint to get genres from MongoDB
  @Get()
  async getGenres() {
    return this.genresService.getGenres();
  } 
}