import { Injectable } from '@nestjs/common';
import { CreateJuegoDto } from './dto/create-juego.dto';
import { UpdateJuegoDto } from './dto/update-juego.dto';

@Injectable()
export class JuegosService {
   publicar(createJuegoDto: CreateJuegoDto) {
      return 'This action adds a new juego';
   }

   obtener() {
      return `This action returns all juegos`;
   }

   obtenerUno(id: number) {
      return `This action returns a #${id} juego`;
   }

   actualizar(id: number, updateJuegoDto: UpdateJuegoDto) {
      return `This action updates a #${id} juego`;
   }

   eliminar(id: number) {
      return `This action removes a #${id} juego`;
   }
}
