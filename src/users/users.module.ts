import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ProviderPrismaModule } from 'src/provider-prisma/provider-prisma.module';
import { ProviderJwtModule } from 'src/provider-jwt/provider-jwt.module';

@Module({
   imports: [ProviderPrismaModule, ProviderJwtModule],
   controllers: [UsersController],
   providers: [UsersService],
})
export class UsersModule {}
