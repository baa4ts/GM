import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/provider-prisma/provider-prisma.service';

@Injectable()
export class CategoriaService {
   constructor(private prisma: PrismaService) {}

   async categoriasJuegos(categorias?: string) {
      try {
         if (!categorias) {
            // Si no hay categorias, devolver todas
            const todas = await this.prisma.categoria.findMany({ select: { nombre: true } });
            return {
               total: todas.length,
               nombres: todas.map((c) => c.nombre),
            };
         }

         // Si hay categorias, devolver juegos filtrados
         const juegos = await this.prisma.juego.findMany({
            where: {
               AND: categorias.split(',').map((nombre) => ({ categorias: { some: { nombre } } })),
            },
            include: {
               categorias: { select: { nombre: true } },
               imagenes: { select: { href: true } },
               usuario: { select: { id: true, username: true, icon: true } },
            },
         });

         return juegos.map((juego) => ({
            titulo: juego.titulo,
            descripcion: juego.descripcion,
            precio: juego.precio,
            usuario: juego.usuario,
            imagenes: juego.imagenes.map((i) => i.href),
            categorias: juego.categorias.map((c) => c.nombre),
         }));
      } catch (error) {
         if (error instanceof UnauthorizedException) throw error;
         throw new InternalServerErrorException('Error al obtener categorias o juegos');
      }
   }

   // async obtener() {
   //   try {
   //     const categorias = await this.prisma.categoria.findMany({ select: { nombre: true } });
   //     return {
   //       total: categorias.length,
   //       nombres: categorias.map((c) => c.nombre),
   //     };
   //   } catch (error) {
   //     // manejo de error basico
   //     if (error instanceof UnauthorizedException) throw error;
   //     throw new InternalServerErrorException('Error al obtener categorias');
   //   }
   // }

   // async obtenerJuego(categorias: string) {
   //   try {

   //     const categoriaLista = categorias ? categorias.split(',') : [];

   //     const juegos = await this.prisma.juego.findMany({
   //       where: {
   //         AND: categoriaLista.map((nombre) => ({ categorias: { some: { nombre } } })),
   //       },
   //       include: {
   //         categorias: { select: { nombre: true } },
   //         imagenes: { select: { href: true } },
   //         usuario: { select: { id: true, username: true, icon: true } },
   //       },
   //     });

   //     return juegos.map((juego) => ({
   //       titulo: juego.titulo,
   //       descripcion: juego.descripcion,
   //       precio: juego.precio,
   //       usuario: juego.usuario,
   //       imagenes: juego.imagenes.map((i) => i.href),
   //       categorias: juego.categorias.map((c) => c.nombre),
   //     }));
   //   } catch (error) {
   //     if (error instanceof UnauthorizedException) throw error;
   //     throw new InternalServerErrorException('Error al obtener categorias');
   //   }
   // }
}
