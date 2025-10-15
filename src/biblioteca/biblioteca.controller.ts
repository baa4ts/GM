import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { BibliotecaService } from './biblioteca.service';
import { RegistrarJuegoDtos } from './dto/registrar.dtos';
import type { Request } from 'express';
import { Permiso } from 'src/seguridad-roles/reflectores/permiso.decorador';
import { SeguridadRolesGuard } from 'src/seguridad-roles/seguridad-roles.guard';

@Controller('biblioteca')
export class BibliotecaController {
   constructor(private readonly bibliotecaService: BibliotecaService) {}

   @Post()
   @UseGuards(SeguridadRolesGuard)
   @Permiso(1)
   create(@Req() req: Request, @Body() datos: RegistrarJuegoDtos) {
      return this.bibliotecaService.registrar(req, datos);
   }

   @Get()
   @UseGuards(SeguridadRolesGuard)
   @Permiso(1)
   findAll(@Req() req: Request) {
      return this.bibliotecaService.listar(req);
   }
}
