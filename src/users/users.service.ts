import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegistrarUserDto } from './dto/registrar-user.dto';
import { PrismaService } from 'src/provider-prisma/provider-prisma.service';
import * as bcrypt from 'bcrypt';
import { AutenticarUserDtos } from './dto/autenticar-user.dtos';
import { User } from 'generated/prisma';
import { ActualizarUserDto } from './dto/actualizar-user.dtos';
import { ProviderJwtService } from 'src/provider-jwt/provider-jwt.service';
import { Request } from 'express';

@Injectable()
export class UsersService {
   constructor(
      private readonly prisma: PrismaService,
      private readonly jwtService: ProviderJwtService,
   ) {}

   /** Verifica si un usuario existe */
   private async checkUsuario(identificador: string | string[]): Promise<boolean> {
      try {
         const usuario = await this.prisma.user.findFirst({
            where: {
               OR: Array.isArray(identificador)
                  ? [{ username: { in: identificador } }, { email: { in: identificador } }]
                  : [
                       { username: identificador },
                       { email: identificador },
                       ...(isNaN(Number(identificador)) ? [] : [{ id: Number(identificador) }]),
                    ],
            },
         });

         return !!usuario;
      } catch (error) {
         console.error('Error al verificar usuario:', error);
         return false;
      }
   }

   /** Obtiene un usuario completo */
   private async usuario(identificador: string | string[]): Promise<User | null> {
      try {
         const usuario = await this.prisma.user.findFirst({
            where: {
               OR: Array.isArray(identificador)
                  ? [{ username: { in: identificador } }, { email: { in: identificador } }]
                  : [
                       { username: identificador },
                       { email: identificador },
                       ...(isNaN(Number(identificador)) ? [] : [{ id: Number(identificador) }]),
                    ],
            },
         });

         return usuario ?? null;
      } catch (error) {
         console.error('Error al obtener usuario:', error);
         return null;
      }
   }

   /** Registra un nuevo usuario */
   async registrar(datos: RegistrarUserDto) {
      // validar si usuario o email ya existen
      const existe = await this.checkUsuario([datos.username, datos.email]);
      if (existe) throw new BadRequestException('Usuario o email ya registrado');

      try {
         // crear usuario en la base
         const nuevoUsuario = await this.prisma.user.create({
            data: {
               username: datos.username,
               email: datos.email,
               password: await bcrypt.hash(datos.password, 10),
            },
         });

         const token = this.jwtService.generar({
            sub: nuevoUsuario.id,
            username: nuevoUsuario.username,
            email: nuevoUsuario.email,
            permiso: nuevoUsuario.permiso,
         });

         // retornar info basica del usuario
         return {
            id: nuevoUsuario.id,
            username: nuevoUsuario.username,
            email: nuevoUsuario.email,
            bio: nuevoUsuario.bio,
            meta: { icono: nuevoUsuario.icon, banner: nuevoUsuario.banner },
            seguridad: { token },
         };
      } catch (error) {
         console.error('Error al crear usuario:', error);
         throw new InternalServerErrorException('Error interno al crear usuario');
      }
   }

   /** Autentica un usuario */
   async autenticar(datos: AutenticarUserDtos) {
      const { username, password } = datos;

      // buscar usuario
      const usuarioEncontrado = await this.usuario(username);
      if (!usuarioEncontrado) throw new UnauthorizedException('Credenciales invalidas');

      // validar password
      const passwordValida = await bcrypt.compare(password, usuarioEncontrado.password);
      if (!passwordValida) throw new UnauthorizedException('Credenciales invalidas');

      try {
         const token = this.jwtService.generar({
            sub: usuarioEncontrado.id,
            username: usuarioEncontrado.username,
            email: usuarioEncontrado.email,
            permiso: usuarioEncontrado.permiso,
         });

         // retornar info basica
         return {
            id: usuarioEncontrado.id,
            username: usuarioEncontrado.username,
            email: usuarioEncontrado.email,
            bio: usuarioEncontrado.bio,
            meta: { icono: usuarioEncontrado.icon, banner: usuarioEncontrado.banner },
            seguridad: { token },
         };
      } catch (error) {
         console.error('Error al generar token:', error);
         throw new InternalServerErrorException('Error interno al autenticar usuario');
      }
   }

   /** Lista todos los usuarios */
   async listar() {
      try {
         const usuarios = await this.prisma.user.findMany({
            select: { id: true, username: true, icon: true, banner: true },
            orderBy: { id: 'desc' },
         });
         return usuarios;
      } catch (error) {
         console.error('Error al obtener usuarios:', error);
         throw new InternalServerErrorException('Error interno al obtener usuarios');
      }
   }

   /** Actualizar datos del usuario */
   async actualizar(req: Request, datos: ActualizarUserDto) {
      try {
         const userId = req['user']?.['sub'];
         if (!userId) throw new UnauthorizedException('Usuario no autenticado');

         const usuarioActualizado = await this.prisma.user.update({
            where: { id: userId },
            data: datos,
         });

         // retornar info basica
         return {
            id: usuarioActualizado.id,
            username: usuarioActualizado.username,
            email: usuarioActualizado.email,
            bio: usuarioActualizado.bio,
            meta: { icono: usuarioActualizado.icon, banner: usuarioActualizado.banner },
         };
      } catch (error) {
         console.error('Error al actualizar usuario:', error);

         // si no existe el usuario, prisma lanza error de tipo P2025
         if (error?.code === 'P2025') throw new NotFoundException('Usuario no encontrado');

         throw new InternalServerErrorException('Error interno al actualizar usuario');
      }
   }

   /** Busca un usuario por identificador */
   async buscarUno(identificador: string) {
      // buscar usuario
      const usuarioEncontrado = await this.usuario(identificador);
      if (!usuarioEncontrado) throw new NotFoundException('Usuario no encontrado');

      try {
         let juegos: any[] = [];

         if (usuarioEncontrado.permiso === 2) {
            const juegosRaw = await this.prisma.juego.findMany({
               where: { usuarioId: usuarioEncontrado.id },
               include: { categorias: true, imagenes: true },
            });

            juegos = juegosRaw.map((j) => ({
               id: j.id,
               titulo: j.titulo,
               descripcion: j.descripcion,
               precio: j.precio,
               categorias: j.categorias.map((c) => c.nombre),
               meta: { imagenes: j.imagenes.map((i) => i.href) },
            }));
         }

         // retornar info basica
         return {
            id: usuarioEncontrado.id,
            username: usuarioEncontrado.username,
            email: usuarioEncontrado.email,
            bio: usuarioEncontrado.bio,
            meta: { icono: usuarioEncontrado.icon, banner: usuarioEncontrado.banner },
            ...(usuarioEncontrado.permiso === 2 && { juegos }),
         };
      } catch (error) {
         console.error('Error al obtener juegos del usuario:', error);
         throw new InternalServerErrorException('Error interno al buscar usuario');
      }
   }
}
