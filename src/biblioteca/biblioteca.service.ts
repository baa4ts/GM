import { Injectable, UnauthorizedException, InternalServerErrorException, HttpStatus } from '@nestjs/common';
import { RegistrarJuegoDtos } from './dto/registrar.dtos';
import type { Request } from 'express';
import { PrismaService } from 'src/provider-prisma/provider-prisma.service';

@Injectable()
export class BibliotecaService {
   constructor(private readonly prisma: PrismaService) {}

   /** Registrar juegos en la biblioteca */
   async registrar(req: Request, datos: RegistrarJuegoDtos) {
      const userId = req['user']?.['sub'];
      if (!userId) throw new UnauthorizedException('Usuario no autenticado');

      try {
         const registros = datos.ids.map((juegoId) => ({
            usuarioId: userId,
            juegoId,
         }));

         const resultado = await this.prisma.biblioteca.createMany({
            data: registros,
         });

         return {
            count: resultado.count,
            juegos: [],
         };
      } catch (error) {
         console.error(error);
         throw new InternalServerErrorException('Ocurrio un error al registrar los juegos');
      }
   }

   /** Listar juegos de la biblioteca del usuario */
   async listar(req: Request, page: number = 1, limit: number = 10) {
      const userId = req['user']?.['sub'];
      if (!userId) throw new UnauthorizedException('Usuario no autenticado');

      try {
         const skip = (page - 1) * limit;

         const total = await this.prisma.biblioteca.count({
            where: { usuarioId: userId },
         });

         const registros = await this.prisma.biblioteca.findMany({
            where: { usuarioId: userId },
            include: {
               juego: { include: { categorias: true, imagenes: true } },
            },
            take: limit,
            skip,
         });

         const juegos = registros.map((j) => ({
            id: j.juego.id,
            titulo: j.juego.titulo,
            descripcion: j.juego.descripcion,
            link: j.juego.link,
            imagenes: j.juego.imagenes.map((i) => i.href),
            categorias: j.juego.categorias.map((c) => c.nombre),
         }));

         return {
            pagination: {
               page,
               limit,
               total,
               totalPages: Math.ceil(total / limit),
            },
            juegos,
         };
      } catch (error) {
         console.error(error);
         throw new InternalServerErrorException('Ocurrio un error al obtener los juegos');
      }
   }
}
