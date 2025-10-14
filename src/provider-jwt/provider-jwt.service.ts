import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class ProviderJwtService {
   private readonly secret = process.env.JWT_SECRET || '123456';

   generar(payload: object) {
      return jwt.sign(payload, this.secret, { expiresIn: '1h' });
   }

   verificar(token: string) {
      return jwt.verify(token, this.secret);
   }

   decodificar(token: string) {
      return jwt.decode(token, { json: true });
   }
}
