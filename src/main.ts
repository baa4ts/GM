import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
   const app = await NestFactory.create(AppModule);

   app.useGlobalPipes(
      /**
       * Habilita la trasformacion y conversion de los datos del post
       * link: https://docs.nestjs.com/techniques/validation
       */
      new ValidationPipe({
         transform: true,
         whitelist: true,
         forbidNonWhitelisted: true,
         forbidUnknownValues: true,
         transformOptions: {
            enableImplicitConversion: true,
         },
         stopAtFirstError: true,
      }),
   );

   await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
