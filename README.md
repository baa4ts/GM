# 🎮 Game Store Backend

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge\&logo=nestjs\&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge\&logo=prisma\&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge\&logo=jsonwebtokens\&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge\&logo=node.js\&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge\&logo=pnpm\&logoColor=white)

Backend del proyecto **Game Store**, desarrollado como parte del curso de programacion.

### Funcionalidades actuales

* usuarios (Registrar, Autenticar, obtener uno, listar, actualizar)
* juegos (Publicar, Listar, Actualizar y eliminar)
* categorias (listar categorias, filtrar juegos por categorias)
* biblioteca (registrar: luego de una pasarela de pago se puede registrar el juego en la biblioteca del usuario, listar: lista los juegos en la biblioteca del usuario, incluye filtrado por categorias tambien)

#### Seguridad

* JWT
* Guard de niveles

#### base de datos

* ORM: prisa
* Sqlite

## Instalacion

* Gestor de paquetes pnpm

```
npm i -g pnpm
```

* Instalar las dependencias del proyecto

```
pnpm install
```

> [!IMPORTANT]
> Si luego de ejecutar pnpm install sale un mensaje amarillo seguido de errores ejecutar el siguiente comando `pnpm approve-builds` y borrar este archivo `./prisma/dev.db` y esta carpeta `./prisma/migrations`, la carpeta prisma el .scheme y seed dejarlos tal cual

```
src/
 ├── main.ts
 ├── app.module.ts
 │
 │  # Rutas y sus funcionalidades
 ├── users/
 ├── juegos/
 ├── categoria/
 ├── biblioteca/
 ├── juegos/
 │
 │  # Provider para funcionalidades
 ├── provider-jwt/
 ├── provider-prisma/
 │
 │  # Provider para seguridad
 ├── seguridad-roles/
 └── seguridad-token/
```
