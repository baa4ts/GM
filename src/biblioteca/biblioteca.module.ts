import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { BibliotecaService } from './biblioteca.service';
import { BibliotecaController } from './biblioteca.controller';
import { SeguridadTokenMiddleware } from 'src/seguridad-token/seguridad-token.middleware';
import { ProviderPrismaModule } from 'src/provider-prisma/provider-prisma.module';
import { ProviderJwtModule } from 'src/provider-jwt/provider-jwt.module';

@Module({
   imports: [ProviderPrismaModule, ProviderJwtModule],
   controllers: [BibliotecaController],
   providers: [BibliotecaService],
})
export class BibliotecaModule implements NestModule {
   configure(consumer: MiddlewareConsumer) {
      consumer
         .apply(SeguridadTokenMiddleware)
         .forRoutes({ path: 'biblioteca/', method: RequestMethod.GET }, { path: 'biblioteca/', method: RequestMethod.POST });
   }
}
