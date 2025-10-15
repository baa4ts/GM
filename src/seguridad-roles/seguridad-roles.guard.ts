import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { UserPayload } from 'src/provider-jwt/interfaces/jwt.interface';
import { Reflector } from '@nestjs/core';

@Injectable()
export class SeguridadRolesGuard implements CanActivate {
   // Se utilizan reflectores para facilitar
   // link: https://docs.nestjs.com/fundamentals/execution-context#reflection-and-metadata
   constructor(private reflector: Reflector) {}

   canActivate(context: ExecutionContext): boolean {
      // Obtener el usuario del request y el nivel de permiso requerido
      const usuario = context.switchToHttp().getRequest()['user'] as UserPayload;
      const nivel = this.reflector.get<number>('permiso', context.getHandler());
      if (!nivel) return true;

      // Si tiene el nivel o mas avanza
      return usuario.permiso >= nivel;
   }
}
