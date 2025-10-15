import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserDecoded, UserPayload } from './interfaces/jwt.interface';

@Injectable()
export class ProviderJwtService {
   private readonly secret = process.env.JWT_SECRET || '123456';

   generar(payload: UserPayload): string {
      return jwt.sign(payload, this.secret, { expiresIn: '1h' });
   }

   verificar(token: string): UserDecoded | null {
      try {
         if (token.startsWith('Bearer ')) {
            token = token.slice(7);
         }
         return jwt.verify(token, this.secret) as unknown as UserDecoded;
      } catch (error) {
         console.error('Token invalido o expirado:', error);
         return null;
      }
   }
}
