import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { JuegosService } from './juegos.service';
import { JuegosController } from './juegos.controller';
import { ProviderPrismaModule } from 'src/provider-prisma/provider-prisma.module';
import { SeguridadTokenMiddleware } from 'src/seguridad-token/seguridad-token.middleware';
import { ProviderJwtModule } from 'src/provider-jwt/provider-jwt.module';

@Module({
   imports: [ProviderPrismaModule, ProviderJwtModule],
   controllers: [JuegosController],
   providers: [JuegosService],
})
export class JuegosModule implements NestModule {
   configure(consumer: MiddlewareConsumer) {
      consumer
         .apply(SeguridadTokenMiddleware)
         .forRoutes(
            { path: 'juegos/', method: RequestMethod.POST },
            { path: 'juegos/{*id}', method: RequestMethod.PATCH },
            { path: 'juegos/{*id}', method: RequestMethod.DELETE },
         );
   }
}
