import { Module } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CategoriaController } from './categoria.controller';
import { ProviderPrismaModule } from 'src/provider-prisma/provider-prisma.module';

@Module({
   imports: [ProviderPrismaModule],
   controllers: [CategoriaController],
   providers: [CategoriaService],
})
export class CategoriaModule {}
