import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegistrarUserDto } from './dto/registrar-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  registrar(@Body() datos: RegistrarUserDto) {
    return this.usersService.registrar(datos);
  }

  @Get()
  listar() {
    return this.usersService.listar();
  }

  @Get(':id')
  buscarUno(@Param('id') id: string) {
    return this.usersService.buscarUno(+id);
  }
}
