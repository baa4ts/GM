import { Injectable, NestMiddleware, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ProviderJwtService } from 'src/provider-jwt/provider-jwt.service';
import { PrismaService } from 'src/provider-prisma/provider-prisma.service';
import { UserDecoded, UserPayload } from 'src/provider-jwt/interfaces/jwt.interface';

@Injectable()
export class SeguridadTokenMiddleware implements NestMiddleware {
   constructor(
      private readonly prisma: PrismaService,
      private readonly jwtService: ProviderJwtService,
   ) {}

   async use(req: Request, res: Response, next: NextFunction) {
      const token = req.headers.authorization;
      if (!token) throw new UnauthorizedException('Token bearer faltante');

      const user: UserDecoded | null = this.jwtService.verificar(token);
      if (!user) throw new UnauthorizedException('Token invalido o modificado');

      try {
         const usuario = await this.prisma.user.findFirst({
            where: {
               OR: [{ id: user.sub }, { username: user.username }, { email: user.email }],
            },
         });

         if (!usuario) throw new UnauthorizedException('No esta autenticado');
         req['user'] = user as UserPayload;
      } catch {
         throw new InternalServerErrorException('Error al verificar el token');
      }

      next();
   }
}
