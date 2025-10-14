import { Module } from '@nestjs/common';
import { SeguridadTokenMiddleware } from './seguridad-token.middleware';
import { ProviderJwtModule } from 'src/provider-jwt/provider-jwt.module';
import { ProviderPrismaModule } from 'src/provider-prisma/provider-prisma.module';

@Module({
   imports: [ProviderJwtModule, ProviderPrismaModule],
   providers: [SeguridadTokenMiddleware],
   exports: [SeguridadTokenMiddleware],
})
export class SeguridadTokenModule {}
