import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegistrarUserDto } from './dto/registrar-user.dto';
import { AutenticarUserDtos } from './dto/autenticar-user.dtos';

@Controller('users')
export class UsersController {
   constructor(private readonly usersService: UsersService) {}

   @Post('registrar')
   registrar(@Body() datos: RegistrarUserDto) {
      return this.usersService.registrar(datos);
   }

   @Post('autenticar')
   autenticar(@Body() datos: AutenticarUserDtos) {
      return this.usersService.autenticar(datos);
   }

   @Get()
   listar() {
      return this.usersService.listar();
   }

   @Get(':identificador')
   buscarUno(@Param('identificador') identificador: string) {
      return this.usersService.buscarUno(identificador);
   }
}
