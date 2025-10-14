import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProviderPrismaModule } from './provider-prisma/provider-prisma.module';
import { CategoriaModule } from './categoria/categoria.module';

@Module({
   imports: [UsersModule, ProviderPrismaModule, CategoriaModule],
   controllers: [],
   providers: [],
})
export class AppModule {}
