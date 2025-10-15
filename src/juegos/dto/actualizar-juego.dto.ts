import { PartialType } from '@nestjs/mapped-types';
import { PublicarJuegoDtos } from './publicar-juego.dto';

export class ActualizarJuegoDto extends PartialType(PublicarJuegoDtos) {}
