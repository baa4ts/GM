import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegistrarUserDto } from './dto/registrar-user.dto';
import { PrismaService } from 'src/provider-prisma/provider-prisma.service';
import * as bcrypt from 'bcrypt';
import { AutenticarUserDtos } from './dto/autenticar-user.dtos';
import { User } from 'generated/prisma';
import { ActualizarUserDto } from './dto/actualizar-user.dtos';
import { ProviderJwtService } from 'src/provider-jwt/provider-jwt.service';

@Injectable()
export class UsersService {
   constructor(
      private readonly prisma: PrismaService,
      private readonly jwtService: ProviderJwtService,
   ) {}

   /** Verifica si un usuario existe */
   private async checkUsuario(identificador: string | string[]): Promise<boolean> {
      try {
         return !!(await this.prisma.user.findFirst({
            where: {
               OR: Array.isArray(identificador)
                  ? [{ username: { in: identificador } }, { email: { in: identificador } }]
                  : [
                       { username: identificador },
                       { email: identificador },
                       ...(isNaN(Number(identificador)) ? [] : [{ id: Number(identificador) }]),
                    ],
            },
         }));
      } catch (error) {
         // manejo de error basico
         return false;
      }
   }

   /** Obtiene un usuario completo */
   private async usuario(identificador: string | string[]): Promise<User | null> {
      try {
         return await this.prisma.user.findFirst({
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
      } catch (error) {
         // manejo de error basico
         return null;
      }
   }

   /** Registra un nuevo usuario */
   async registrar(datos: RegistrarUserDto) {
      try {
         // verificar si usuario o email ya existen
         if (await this.checkUsuario([datos.username, datos.email])) throw new BadRequestException('Usuario o email ya registrado');

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
            seguridad: {
               token: token,
            },
         };
      } catch (error) {
         // manejo de error basico
         if (error instanceof BadRequestException) throw error;
         throw new InternalServerErrorException('Error al crear el usuario');
      }
   }

   /** Autentica un usuario */
   async autenticar(datos: AutenticarUserDtos) {
      try {
         // obtener username y password del dto
         const { username, password } = datos;

         // buscar usuario por username
         const usuarioEncontrado = await this.usuario(username);
         if (!usuarioEncontrado) throw new UnauthorizedException('Credenciales invalidas');

         // validar password en una sola linea
         if (!(await bcrypt.compare(password, usuarioEncontrado.password))) throw new UnauthorizedException('Credenciales invalidas');

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
            seguridad: {
               token: token,
            },
         };
      } catch (error) {
         // manejo de error basico
         if (error instanceof UnauthorizedException) throw error;
         throw new InternalServerErrorException('Error al autenticar usuario');
      }
   }

   /** Lista todos los usuarios */
   async listar() {
      try {
         return await this.prisma.user.findMany({
            select: { id: true, username: true, icon: true, banner: true },
            orderBy: { id: 'desc' },
         });
      } catch (error) {
         // manejo de error basico
         throw new InternalServerErrorException('Error al obtener los usuarios');
      }
   }

   /** Actualizar datos del usuario */
   async actualizar(req: Request, datos: ActualizarUserDto) {
      try {
         const usuarioActualizado = await this.prisma.user.update({
            where: { id: req['user']['sub'] },
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
         // manejo de error basico
         if (error instanceof NotFoundException) throw error;
         throw new InternalServerErrorException('Error al buscar el usuario');
      }
   }

   /** Busca un usuario por identificador */
   async buscarUno(identificador: string) {
      try {
         const usuarioEncontrado = await this.usuario(identificador);

         if (!usuarioEncontrado) throw new NotFoundException('Usuario no encontrado');

         let juegos: any = [];

         if (usuarioEncontrado.permiso === 2) {
            const juegosRaw = await this.prisma.juego.findMany({
               where: { usuarioId: usuarioEncontrado.id },
               include: {
                  categorias: true,
                  imagenes: true,
               },
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

            // Retornar solo si el usuario es developer
            ...(usuarioEncontrado.permiso === 2 && { juegos }),
         };
      } catch (error) {
         // manejo de error basico
         if (error instanceof NotFoundException) throw error;
         throw new InternalServerErrorException('Error al buscar el usuario');
      }
   }
}
