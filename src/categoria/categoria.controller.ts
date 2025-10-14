import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CategoriaService } from './categoria.service';

@Controller('categoria')
export class CategoriaController {
   constructor(private readonly categoriaService: CategoriaService) {}

   @Get()
   obtener(@Query('categorias') categorias?: string) {
      return this.categoriaService.categoriasJuegos(categorias);
   }

   // @Get()
   // obtener() {
   //    return this.categoriaService.obtener();
   // }

   // @Get("juegos")
   // obtenerJuego(@Query('categorias') categorias: string) {
   //    return this.categoriaService.obtenerJuego(categorias);
   // }
}
