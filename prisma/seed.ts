import { PrismaClient } from '../generated/prisma'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    try {
        const hashedPassword = await bcrypt.hash('admin', 10)

        const categorias = [
            'accion',
            'aventura',
            'rol',
            'simulacion',
            'deportes',
            'estrategia',
            'terror',
            'plataformas',
            'arcade',
            'puzzle',
            'musical',
            'carreras',
            'disparos',
            'lucha',
            'sigilo',
            'sandbox',
            'mundo abierto',
            'supervivencia',
            'multijugador',
            'cooperativo',
            'battle royale',
            'historia interactiva',
            'novela visual',
            'educativo',
            'casual',
            'retro',
            'fantasia',
            'ciencia ficcion',
            'cyberpunk',
            'medieval',
            'espacial',
            'horror psicologico',
            'metroidvania',
            'roguelike',
            'tower defense',
            'idle',
            'clicker',
            'cartas',
            'mesa',
            'misterio',
            'anime',
            'pixel art',
            'realista',
            'sandbox creativo',
            'horror de supervivencia',
            'humor',
            'experiencia narrativa',
        ]

        const admin = await prisma.user.create({
            data: {
                username: 'admin',
                email: 'admin@example.com',
                permiso: 5,
                password: hashedPassword,
            },
        })

        await prisma.categoria.createMany({
            data: categorias.map((nombre) => ({
                nombre,
                usuarioId: admin.id,
            })),
        })

        console.log('usuario admin creado:', admin)
        console.log('categorias insertadas:', categorias.length)
    } catch (error) {
        console.error('error creando usuario admin:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
