import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProviderPrismaModule } from './provider-prisma/provider-prisma.module';

@Module({
   imports: [UsersModule, ProviderPrismaModule],
   controllers: [],
   providers: [],
})
export class AppModule {}
