import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Genre, GenreDocument } from '../schemas/genre.schema';
import axios from 'axios';

@Injectable()
export class GenresService {
  private readonly logger = new Logger(GenresService.name);

  constructor(
    @InjectModel(Genre.name) private genreModel: Model<GenreDocument>) {}

    async fetchGenreFromTMDB(): Promise<any[]> {
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?language=en`,{
                headers: {
                  'accept': 'application/json',
                  'Authorization': 'Bearer '+ process.env.TMDB_AUTH_KEY
                }});
            return response.data.genres;
        } catch (error) {
            console.error('Error fetching Genre from TMDB:', error);
            return [];
        }
    }

    // Fetch genres from TMDB and store in MongoDB
    async syncGenres(): Promise<void> {
        const genres = await this.fetchGenreFromTMDB();  // Fetch genres from TMDB

        for (const genre of genres) {
            // Check if genre already exists in MongoDB
            const existingGenre = await this.genreModel.findOne({ id: genre.id }).exec();
            
            if (!existingGenre) {
                // Save the new genre to MongoDB
                const newGenre = new this.genreModel({
                id: genre.id,
                name: genre.name,
                });

                await newGenre.save();
                this.logger.log(`Saved genre: ${genre.name}`);
            } else {
                this.logger.log(`Genre already exists: ${genre.name}`);
            }
        }
    }

    // Retrieve genres from MongoDB
    async getGenres(): Promise<Genre[]> {
        return this.genreModel.find().exec();
    }
}