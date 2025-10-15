import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ProviderPrismaModule } from 'src/provider-prisma/provider-prisma.module';
import { ProviderJwtModule } from 'src/provider-jwt/provider-jwt.module';
import { SeguridadTokenMiddleware } from 'src/seguridad-token/seguridad-token.middleware';

@Module({
   imports: [ProviderPrismaModule, ProviderJwtModule],
   controllers: [UsersController],
   providers: [UsersService],
})
export class UsersModule implements NestModule {
   configure(consumer: MiddlewareConsumer) {
      consumer.apply(SeguridadTokenMiddleware).forRoutes({ path: 'users/', method: RequestMethod.PATCH });
   }
}
