import { Injectable } from '@nestjs/common';
import { RegistrarUserDto } from './dto/registrar-user.dto';

@Injectable()
export class UsersService {
  registrar(datos: RegistrarUserDto) {
    return 'This action adds a new user';
  }

  listar() {
    return `This action returns all users`;
  }

  buscarUno(id: number) {
    return `This action returns a #${id} user`;
  }
}
