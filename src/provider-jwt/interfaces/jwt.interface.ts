export interface UserDecoded {
   sub: number;
   username: string;
   email: string;
   permiso: number;
   iat: number;
   exp: number;
}

export interface UserPayload {
   sub: number;
   username: string;
   email: string;
   permiso: number;
}
