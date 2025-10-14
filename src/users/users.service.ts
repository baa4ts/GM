import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegistrarUserDto } from './dto/registrar-user.dto';
import { PrismaService } from 'src/provider-prisma/provider-prisma.service';
import * as bcrypt from 'bcrypt';
import { AutenticarUserDtos } from './dto/autenticar-user.dtos';
import { User } from 'generated/prisma';
import { ActualizarUserDto } from './dto/actualizar-user.dtos';

@Injectable()
export class UsersService {
   constructor(private prisma: PrismaService) {}

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

         // retornar info basica del usuario
         return {
            id: nuevoUsuario.id,
            username: nuevoUsuario.username,
            email: nuevoUsuario.bio,
            bio: nuevoUsuario.bio,
            meta: { icono: nuevoUsuario.icon, banner: nuevoUsuario.banner },
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

         // retornar info basica
         return {
            id: usuarioEncontrado.id,
            username: usuarioEncontrado.username,
            email: usuarioEncontrado.email,
            bio: usuarioEncontrado.bio,
            meta: { icono: usuarioEncontrado.icon, banner: usuarioEncontrado.banner },
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
   async actualizar(datos: ActualizarUserDto) {
      try {
         const usuarioActualizado = await this.prisma.user.update({
            where: { id: 1 },
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

         // retornar info basica
         return {
            id: usuarioEncontrado.id,
            username: usuarioEncontrado.username,
            email: usuarioEncontrado.email,
            bio: usuarioEncontrado.bio,
            meta: { icono: usuarioEncontrado.icon, banner: usuarioEncontrado.banner },
         };
      } catch (error) {
         // manejo de error basico
         if (error instanceof NotFoundException) throw error;
         throw new InternalServerErrorException('Error al buscar el usuario');
      }
   }
}
