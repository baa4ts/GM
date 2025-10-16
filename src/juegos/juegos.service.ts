import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ActualizarJuegoDto } from './dto/actualizar-juego.dto';
import { PrismaService } from 'src/provider-prisma/provider-prisma.service';
import { PublicarJuegoDtos } from './dto/publicar-juego.dto';
import { Request } from 'express';
import { off } from 'process';
import { json } from 'stream/consumers';

@Injectable()
export class JuegosService {
   constructor(private readonly prisma: PrismaService) {}

   /** Verifica si un juego pertenece a un usuario */
   private async pertenece(id: number, userId: number): Promise<boolean> {
      try {
         const juego = await this.prisma.juego.findFirst({ where: { AND: [{ id }, { usuarioId: userId }] } });
         return !!juego;
      } catch (error) {
         console.error('Error al verificar juego:', error);
         return false;
      }
   }

   /** Verifica si ya existe un juego con el mismo titulo */
   private async existe(datos: PublicarJuegoDtos): Promise<boolean> {
      try {
         const juego = await this.prisma.juego.findFirst({ where: { titulo: datos.titulo } });
         return !!juego;
      } catch (error) {
         console.error('Error al verificar si el juego existe:', error);
         return false;
      }
   }

   /** Publica un nuevo juego */
   async publicar(req: Request, datos: PublicarJuegoDtos) {
      try {
         const userId = req['user']?.['sub'];
         if (!userId) throw new UnauthorizedException('Usuario no autenticado');

         if (await this.existe(datos)) throw new BadRequestException('Ya existe un juego con ese titulo');

         const juegoNuevo = await this.prisma.juego.create({
            data: {
               titulo: datos.titulo,
               descripcion: datos.descripcion ?? 'Sin descripcion',
               link: datos.link,
               precio: datos.precio,
               usuario: { connect: { id: userId } },
               imagenes: { create: datos.imagenes.map((href) => ({ href })) },
               categorias: { connect: datos.categorias.map((nombre) => ({ nombre })) },
            },
            include: { usuario: true, categorias: true, imagenes: true },
         });

         return {
            id: juegoNuevo.id,
            titulo: juegoNuevo.titulo,
            descripcion: juegoNuevo.descripcion,
            precio: juegoNuevo.precio,
            usuario: { id: juegoNuevo.usuario.id, username: juegoNuevo.usuario.username, icon: juegoNuevo.usuario.icon },
            imagenes: juegoNuevo.imagenes.map((i) => i.href),
            categorias: juegoNuevo.categorias.map((c) => c.nombre),
         };
      } catch (error) {
         console.error('Error al publicar juego:', error);
         throw new InternalServerErrorException('Error interno al publicar el juego');
      }
   }

   /** Lista todos los juegos */
   async listar(page: number = 1, limit: number = 10, categorias?: string) {
      try {
         const skip = (page - 1) * limit;

         const where: any = {};
         if (categorias) {
            const lista = categorias.split(',').map((c) => c.trim().toLowerCase());
            where.categorias = { some: { nombre: { in: lista } } };
         }

         const total = await this.prisma.juego.count({ where });

         const juegos = await this.prisma.juego.findMany({
            where,
            include: { categorias: true, imagenes: true, usuario: true },
            take: limit,
            skip,
         });

         return {
            pagination: {
               page,
               limit,
               total,
               totalPages: Math.ceil(total / limit),
            },
            juegos: juegos.map((j) => ({
               id: j.id,
               titulo: j.titulo,
               descripcion: j.descripcion,
               precio: j.precio,
               usuario: {
                  id: j.usuario.id,
                  username: j.usuario.username,
                  icon: j.usuario.icon,
               },
               imagenes: j.imagenes.map((i) => i.href),
               categorias: j.categorias.map((c) => c.nombre),
            })),
         };
      } catch (error) {
         console.error('Error al obtener juegos:', error);
         throw new InternalServerErrorException('Error interno al obtener juegos');
      }
   }

   /** Busca un juego por id */
   async buscar(id: number) {
      try {
         if (!id) throw new BadRequestException('Id faltante o invalido');

         const juego = await this.prisma.juego.findFirst({ where: { id }, include: { usuario: true, categorias: true, imagenes: true } });
         if (!juego) throw new NotFoundException('Juego no encontrado');

         return {
            id: juego.id,
            titulo: juego.titulo,
            descripcion: juego.descripcion,
            precio: juego.precio,
            usuario: { id: juego.usuario.id, username: juego.usuario.username, icon: juego.usuario.icon },
            imagenes: juego.imagenes.map((i) => i.href),
            categorias: juego.categorias.map((c) => c.nombre),
         };
      } catch (error) {
         console.error('Error al obtener juego:', error);
         throw new InternalServerErrorException('Error interno al obtener juego');
      }
   }

   /** Actualiza un juego existente */
   async actualizar(req: Request, id: number, datos: ActualizarJuegoDto) {
      try {
         const userId = req['user']?.['sub'];
         if (!userId) throw new UnauthorizedException('Usuario no autenticado');

         const juegoActualizado = await this.prisma.juego.update({
            where: { id },
            data: {
               titulo: datos.titulo,
               descripcion: datos.descripcion,
               link: datos.link,
               imagenes: { create: datos.imagenes?.map((href) => ({ href })) },
               categorias: { connect: datos.categorias?.map((nombre) => ({ nombre })) },
            },
            include: { usuario: true, imagenes: true, categorias: true },
         });

         return {
            id: juegoActualizado.id,
            titulo: juegoActualizado.titulo,
            descripcion: juegoActualizado.descripcion,
            precio: juegoActualizado.precio,
            usuario: { id: juegoActualizado.usuario.id, username: juegoActualizado.usuario.username, icon: juegoActualizado.usuario.icon },
            imagenes: juegoActualizado.imagenes.map((i) => i.href),
            categorias: juegoActualizado.categorias.map((c) => c.nombre),
         };
      } catch (error) {
         console.error('Error al actualizar juego:', error);
         if (error?.code === 'P2025') throw new NotFoundException('Juego no encontrado');
         throw new InternalServerErrorException('Error interno al actualizar juego');
      }
   }

   /** Elimina un juego */
   async eliminar(req: Request, id: number) {
      try {
         const userId = req['user']?.['sub'];
         if (!userId) throw new UnauthorizedException('Usuario no autenticado');

         if (!(await this.pertenece(id, userId))) throw new UnauthorizedException('No puedes eliminar un juego que no te pertenece');

         const juegoEliminado = await this.prisma.juego.delete({ where: { id } });
         return { mensaje: `Juego #${id} eliminado correctamente`, juego: juegoEliminado };
      } catch (error) {
         console.error('Error al eliminar juego:', error);
         throw new InternalServerErrorException('Error interno al eliminar juego');
      }
   }
}
