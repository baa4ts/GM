import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/provider-prisma/provider-prisma.service';

@Injectable()
export class CategoriaService {
   constructor(private prisma: PrismaService) {}

   /** Obtiene las categorias o juegos filtrado por categoria */
   async categoriasJuegos(categorias?: string) {
      try {
         if (!categorias) {
            // si no hay categorias, devolver todas
            const todas = await this.prisma.categoria.findMany({ select: { nombre: true } });
            return {
               total: todas.length,
               nombres: todas.map((c) => c.nombre),
            };
         }

         // si hay categorias, devolver juegos filtrados
         const listaCategorias = categorias.split(',');
         if (listaCategorias.length === 0) return [];

         const juegos = await this.prisma.juego.findMany({
            where: {
               AND: listaCategorias.map((nombre) => ({ categorias: { some: { nombre } } })),
            },
            include: {
               categorias: { select: { nombre: true } },
               imagenes: { select: { href: true } },
               usuario: { select: { id: true, username: true, icon: true } },
            },
         });

         return juegos.map((juego) => ({
            id: juego.id,
            titulo: juego.titulo,
            descripcion: juego.descripcion,
            precio: juego.precio,
            usuario: juego.usuario,
            imagenes: juego.imagenes.map((i) => i.href),
            categorias: juego.categorias.map((c) => c.nombre),
         }));
      } catch (error) {
         console.error('Error al obtener categorias o juegos:', error);
         throw new InternalServerErrorException('Error interno al obtener categorias o juegos');
      }
   }
}
