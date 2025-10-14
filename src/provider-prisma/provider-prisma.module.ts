import { Module } from '@nestjs/common';
import { PrismaService } from './provider-prisma.service';

@Module({
   providers: [PrismaService],
   exports: [PrismaService],
})
export class ProviderPrismaModule {}
