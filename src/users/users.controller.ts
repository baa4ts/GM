import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegistrarUserDto } from './dto/registrar-user.dto';
import { AutenticarUserDtos } from './dto/autenticar-user.dtos';
import { ActualizarUserDto } from './dto/actualizar-user.dtos';
import { Permiso } from 'src/seguridad-roles/reflectores/permiso.decorador';
import { SeguridadRolesGuard } from 'src/seguridad-roles/seguridad-roles.guard';

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

   @Patch()
   @UseGuards(SeguridadRolesGuard)
   @Permiso(1)
   actualizar(@Req() req: any, @Body() datos: ActualizarUserDto) {
      return this.usersService.actualizar(req, datos);
   }

   @Get(':identificador')
   buscarUno(@Param('identificador') identificador: string) {
      return this.usersService.buscarUno(identificador);
   }
}
