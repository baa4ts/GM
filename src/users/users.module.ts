import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ProviderPrismaModule } from 'src/provider-prisma/provider-prisma.module';

@Module({
   imports: [ProviderPrismaModule],
   controllers: [UsersController],
   providers: [UsersService],
})
export class UsersModule {}
