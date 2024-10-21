import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { MoviesModule } from './movies/movies.module';
import { UserModule } from './user/user.module';
import { GenresModule } from './genre/genre.module';
import { CacheModule, CacheInterceptor  } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [ 
    ConfigModule.forRoot(), // Loads .env file
    MongooseModule.forRoot(process.env.DATABASE_URI), // Connects to MongoDB
    MoviesModule, UserModule, GenresModule, // Movie-related logic
    CacheModule.register({
      store: redisStore,    // Redis cache store
      host: 'localhost',    // Redis host
      port: 6379,           // Redis port
      ttl: 600,             // Global TTL: 10 minutes (can be overridden per endpoint)
      max: 100,             // Max number of items in cache (optional)
    }),
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_INTERCEPTOR,     // Provide the CacheInterceptor globally
    useClass: CacheInterceptor,   // Enables caching across all endpoints
  },],
})
export class AppModule {}