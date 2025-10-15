import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProviderPrismaModule } from './provider-prisma/provider-prisma.module';
import { CategoriaModule } from './categoria/categoria.module';
import { JuegosModule } from './juegos/juegos.module';
import { BibliotecaModule } from './biblioteca/biblioteca.module';

@Module({
   imports: [UsersModule, ProviderPrismaModule, CategoriaModule, JuegosModule, BibliotecaModule],
   controllers: [],
   providers: [],
})
export class AppModule {}
