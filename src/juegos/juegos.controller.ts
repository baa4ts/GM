import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { JuegosService } from './juegos.service';
import { ActualizarJuegoDto } from './dto/actualizar-juego.dto';
import { Permiso } from 'src/seguridad-roles/reflectores/permiso.decorador';
import { SeguridadRolesGuard } from 'src/seguridad-roles/seguridad-roles.guard';
import { PublicarJuegoDtos } from './dto/publicar-juego.dto';
import type { Request } from 'express';

@Controller('juegos')
export class JuegosController {
   constructor(private readonly juegosService: JuegosService) {}

   @Post()
   @UseGuards(SeguridadRolesGuard)
   @Permiso(2)
   create(@Req() req: Request, @Body() datos: PublicarJuegoDtos) {
      return this.juegosService.publicar(req, datos);
   }

   @Get()
   findAll() {
      return this.juegosService.listar();
   }

   @Get(':id')
   findOne(@Param('id') id: number) {
      return this.juegosService.buscar(+id);
   }

   @Patch(':id')
   @UseGuards(SeguridadRolesGuard)
   @Permiso(2)
   update(@Req() req: Request, @Param('id') id: number, @Body() datos: ActualizarJuegoDto) {
      return this.juegosService.actualizar(req, id, datos);
   }

   @Delete(':id')
   @UseGuards(SeguridadRolesGuard)
   @Permiso(2)
   remove(@Req() req: Request, @Param('id') id: number) {
      return this.juegosService.eliminar(req, id);
   }
}
