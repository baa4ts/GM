import { SetMetadata } from '@nestjs/common';

export const Permiso = (nivel: number) => SetMetadata('permiso', nivel);
