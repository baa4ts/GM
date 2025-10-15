import { PrismaClient } from '../generated/prisma'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    try {
        const hashedPassword = await bcrypt.hash('admin', 10)

        const categorias = [
            'accion', 'aventura', 'rol', 'simulacion', 'deportes', 'estrategia', 'terror',
            'plataformas', 'arcade', 'puzzle', 'musical', 'carreras', 'disparos', 'lucha',
            'sigilo', 'sandbox', 'mundo abierto', 'supervivencia', 'multijugador', 'cooperativo',
            'battle royale', 'historia interactiva', 'novela visual', 'educativo', 'casual', 'retro',
            'fantasia', 'ciencia ficcion', 'cyberpunk', 'medieval', 'espacial', 'horror psicologico',
            'metroidvania', 'roguelike', 'tower defense', 'idle', 'clicker', 'cartas', 'mesa', 'misterio',
            'anime', 'pixel art', 'realista', 'sandbox creativo', 'horror de supervivencia', 'humor', 'experiencia narrativa',
            'futurista'
        ]

        // crear admin
        const admin = await prisma.user.create({
            data: {
                username: 'admin',
                email: 'admin@example.com',
                permiso: 2,
                password: hashedPassword,
            },
        })

        // crear categorias
        await prisma.categoria.createMany({
            data: categorias.map((nombre) => ({
                nombre,
                usuarioId: admin.id,
            })),
        })

        // publicar juegos automaticos
        const juegos = [
            { titulo: 'Aventura Espacial', descripcion: 'Explora galaxias lejanas', link: 'https://www.mediafire.com', precio: 20, categorias: ['espacial', 'aventura'], imagenes: ['https://placekitten.com/200/300', 'https://placekitten.com/300/300'] },
            { titulo: 'Puzzle Retro', descripcion: 'Resuelve puzzles clasicos', link: 'https://www.mediafire.com', precio: 10, categorias: ['puzzle', 'retro'], imagenes: ['https://placekitten.com/400/300'] },
            { titulo: 'Carreras Futuristas', descripcion: 'Velocidad y adrenalina', link: 'https://www.mediafire.com', precio: 15, categorias: ['carreras', 'futurista'], imagenes: ['https://placekitten.com/500/300'] },
            { titulo: 'RPG Medieval', descripcion: 'Vive una aventura en la edad media', link: 'https://www.mediafire.com', precio: 25, categorias: ['rol', 'medieval'], imagenes: ['https://placekitten.com/600/300'] },
            { titulo: 'Simulacion Agricola', descripcion: 'Maneja tu granja', link: 'https://www.mediafire.com', precio: 12, categorias: ['simulacion', 'casual'], imagenes: ['https://placekitten.com/200/301'] },
            { titulo: 'Lucha 3D', descripcion: 'Combate cuerpo a cuerpo', link: 'https://www.mediafire.com', precio: 18, categorias: ['lucha', '3d'], imagenes: ['https://placekitten.com/201/301'] },
            { titulo: 'Terror Psicologico', descripcion: 'Siente miedo en cada esquina', link: 'https://www.mediafire.com', precio: 22, categorias: ['terror', 'psicologico'], imagenes: ['https://placekitten.com/202/301'] },
            { titulo: 'Sandbox Creativo', descripcion: 'Crea tu mundo', link: 'https://www.mediafire.com', precio: 30, categorias: ['sandbox', 'creativo'], imagenes: ['https://placekitten.com/203/301'] },
            { titulo: 'Tower Defense Clasico', descripcion: 'Defiende tu base', link: 'https://www.mediafire.com', precio: 14, categorias: ['tower defense', 'estrategia'], imagenes: ['https://placekitten.com/204/301'] },
            { titulo: 'Clicker Monster', descripcion: 'Haz click y sube nivel', link: 'https://www.mediafire.com', precio: 5, categorias: ['clicker', 'idle'], imagenes: ['https://placekitten.com/205/301'] },
            { titulo: 'Battle Royale 3000', descripcion: 'Sobrevive hasta el final', link: 'https://www.mediafire.com', precio: 28, categorias: ['battle royale', 'multijugador'], imagenes: ['https://placekitten.com/206/301'] },
            { titulo: 'Novela Visual Amor', descripcion: 'Historia romantica interactiva', link: 'https://www.mediafire.com', precio: 10, categorias: ['novela visual', 'historia interactiva'], imagenes: ['https://placekitten.com/207/301'] },
            { titulo: 'Roguelike Dungeon', descripcion: 'Mazmorras generadas aleatoriamente', link: 'https://www.mediafire.com', precio: 20, categorias: ['roguelike', 'aventura'], imagenes: ['https://placekitten.com/208/301'] },
            { titulo: 'Arcade Shooter', descripcion: 'Dispara y gana puntos', link: 'https://www.mediafire.com', precio: 12, categorias: ['arcade', 'disparos'], imagenes: ['https://placekitten.com/209/301'] },
            { titulo: 'Musical Beat', descripcion: 'Sigue el ritmo', link: 'https://www.mediafire.com', precio: 8, categorias: ['musical', 'casual'], imagenes: ['https://placekitten.com/210/301'] },
            { titulo: 'Educativo Historia', descripcion: 'Aprende jugando', link: 'https://www.mediafire.com', precio: 10, categorias: ['educativo', 'historia'], imagenes: ['https://placekitten.com/211/301'] },
            { titulo: 'Aventura Anime', descripcion: 'Explora mundos estilo anime', link: 'https://www.mediafire.com', precio: 18, categorias: ['aventura', 'anime'], imagenes: ['https://placekitten.com/212/301'] },
            { titulo: 'Pixel Art Quest', descripcion: 'Pixel art retro', link: 'https://www.mediafire.com', precio: 12, categorias: ['pixel art', 'rol'], imagenes: ['https://placekitten.com/213/301'] },
            { titulo: 'Supervivencia Zombie', descripcion: 'Sobrevive a los zombies', link: 'https://www.mediafire.com', precio: 25, categorias: ['supervivencia', 'horror de supervivencia'], imagenes: ['https://placekitten.com/214/301'] },
            { titulo: 'Simulador Espacial', descripcion: 'Maneja tu nave', link: 'https://www.mediafire.com', precio: 20, categorias: ['simulacion', 'espacial'], imagenes: ['https://placekitten.com/215/301'] },
            { titulo: 'Carreras Retro', descripcion: 'Autos clasicos veloces', link: 'https://www.mediafire.com', precio: 15, categorias: ['carreras', 'retro'], imagenes: ['https://placekitten.com/216/301'] },
            { titulo: 'Lucha Anime', descripcion: 'Personajes estilo anime', link: 'https://www.mediafire.com', precio: 18, categorias: ['lucha', 'anime'], imagenes: ['https://placekitten.com/217/301'] },
            { titulo: 'Rol Futurista', descripcion: 'Mundos futuristas para explorar', link: 'https://www.mediafire.com', precio: 22, categorias: ['rol', 'ciencia ficcion'], imagenes: ['https://placekitten.com/218/301'] },
            { titulo: 'Puzzle Minimalista', descripcion: 'Desafios sencillos', link: 'https://www.mediafire.com', precio: 8, categorias: ['puzzle', 'minimalista'], imagenes: ['https://placekitten.com/219/301'] },
            { titulo: 'Sandbox Medieval', descripcion: 'Construye castillos', link: 'https://www.mediafire.com', precio: 28, categorias: ['sandbox', 'medieval'], imagenes: ['https://placekitten.com/220/301'] },
            { titulo: 'Simulador de Deportes', descripcion: 'Juega partidos virtuales', link: 'https://www.mediafire.com', precio: 20, categorias: ['simulacion', 'deportes'], imagenes: ['https://placekitten.com/221/301'] },
            { titulo: 'Horror Psicologico 2', descripcion: 'Mas miedo y tension', link: 'https://www.mediafire.com', precio: 25, categorias: ['terror', 'psicologico'], imagenes: ['https://placekitten.com/222/301'] },
            { titulo: 'Cartas Magicas', descripcion: 'Juego de cartas estrategico', link: 'https://www.mediafire.com', precio: 15, categorias: ['cartas', 'estrategia'], imagenes: ['https://placekitten.com/223/301'] },
            { titulo: 'Misterio en la Mansion', descripcion: 'Resuelve enigmas', link: 'https://www.mediafire.com', precio: 18, categorias: ['misterio', 'aventura'], imagenes: ['https://placekitten.com/224/301'] },
            { titulo: 'RPG Cyberpunk', descripcion: 'Ciudad futurista', link: 'https://www.mediafire.com', precio: 22, categorias: ['rol', 'cyberpunk'], imagenes: ['https://placekitten.com/225/301'] },
            { titulo: 'Tower Defense Futurista', descripcion: 'Defiende tu base futurista', link: 'https://www.mediafire.com', precio: 20, categorias: ['tower defense', 'futurista'], imagenes: ['https://placekitten.com/226/301'] },
            { titulo: 'Idle Clicker Heroes', descripcion: 'Sube niveles automaticamente', link: 'https://www.mediafire.com', precio: 10, categorias: ['idle', 'clicker'], imagenes: ['https://placekitten.com/227/301'] },
            { titulo: 'Aventura Retro', descripcion: 'Explora mundos retro', link: 'https://www.mediafire.com', precio: 18, categorias: ['aventura', 'retro'], imagenes: ['https://placekitten.com/228/301'] },
            { titulo: 'Simulador Educativo', descripcion: 'Aprende mientras juegas', link: 'https://www.mediafire.com', precio: 12, categorias: ['educativo', 'simulacion'], imagenes: ['https://placekitten.com/229/301'] },
            { titulo: 'Carreras Arcade', descripcion: 'Velocidad y diversion', link: 'https://www.mediafire.com', precio: 15, categorias: ['carreras', 'arcade'], imagenes: ['https://placekitten.com/230/301'] },
            { titulo: 'Novela Visual Fantasia', descripcion: 'Historia fantastica', link: 'https://www.mediafire.com', precio: 10, categorias: ['novela visual', 'fantasia'], imagenes: ['https://placekitten.com/231/301'] },
            { titulo: 'Metroidvania Clasico', descripcion: 'Explora niveles interconectados', link: 'https://www.mediafire.com', precio: 20, categorias: ['metroidvania', 'plataformas'], imagenes: ['https://placekitten.com/232/301'] },
            { titulo: 'Roguelike Espacial', descripcion: 'Mazmorras en el espacio', link: 'https://www.mediafire.com', precio: 22, categorias: ['roguelike', 'espacial'], imagenes: ['https://placekitten.com/233/301'] },
            { titulo: 'Sandbox Multijugador', descripcion: 'Crea y juega con amigos', link: 'https://www.mediafire.com', precio: 25, categorias: ['sandbox', 'multijugador'], imagenes: ['https://placekitten.com/234/301'] },
            { titulo: 'Simulacion Musical', descripcion: 'Conviertete en estrella', link: 'https://www.mediafire.com', precio: 12, categorias: ['simulacion', 'musical'], imagenes: ['https://placekitten.com/235/301'] },
            { titulo: 'Disparos Retro', descripcion: 'Accion arcade', link: 'https://www.mediafire.com', precio: 15, categorias: ['disparos', 'retro'], imagenes: ['https://placekitten.com/236/301'] },
            { titulo: 'Historia Interactiva', descripcion: 'Toma decisiones importantes', link: 'https://www.mediafire.com', precio: 18, categorias: ['historia interactiva', 'aventura'], imagenes: ['https://placekitten.com/237/301'] },
            { titulo: 'Sandbox Realista', descripcion: 'Crea tu mundo real', link: 'https://www.mediafire.com', precio: 28, categorias: ['sandbox', 'realista'], imagenes: ['https://placekitten.com/238/301'] },
            { titulo: 'Horror de Supervivencia', descripcion: 'Escapa y sobrevive', link: 'https://www.mediafire.com', precio: 22, categorias: ['horror de supervivencia', 'terror'], imagenes: ['https://placekitten.com/239/301'] },
            { titulo: 'Clicker Anime', descripcion: 'Sube niveles y desbloquea personajes', link: 'https://www.mediafire.com', precio: 10, categorias: ['clicker', 'anime'], imagenes: ['https://placekitten.com/240/301'] },
            { titulo: 'Puzzle Fantasia', descripcion: 'Resuelve desafios magicos', link: 'https://www.mediafire.com', precio: 12, categorias: ['puzzle', 'fantasia'], imagenes: ['https://placekitten.com/241/301'] },
            { titulo: 'Lucha Espacial', descripcion: 'Combate en naves', link: 'https://www.mediafire.com', precio: 20, categorias: ['lucha', 'espacial'], imagenes: ['https://placekitten.com/242/301'] },
            { titulo: 'Carreras Medieval', descripcion: 'Caballos y carruajes', link: 'https://www.mediafire.com', precio: 18, categorias: ['carreras', 'medieval'], imagenes: ['https://placekitten.com/243/301'] },
            { titulo: 'RPG Sandbox', descripcion: 'Aventura y creacion', link: 'https://www.mediafire.com', precio: 25, categorias: ['rol', 'sandbox'], imagenes: ['https://placekitten.com/244/301'] },
            { titulo: 'Simulador Terror', descripcion: 'Vive el miedo', link: 'https://www.mediafire.com', precio: 22, categorias: ['simulacion', 'terror'], imagenes: ['https://placekitten.com/245/301'] },
            { titulo: 'Musical Retro', descripcion: 'Ritmos clasicos', link: 'https://www.mediafire.com', precio: 12, categorias: ['musical', 'retro'], imagenes: ['https://placekitten.com/246/301'] },
            { titulo: 'Pixel Art Carreras', descripcion: 'Autos pixelados', link: 'https://www.mediafire.com', precio: 15, categorias: ['pixel art', 'carreras'], imagenes: ['https://placekitten.com/247/301'] },
            { titulo: 'Educativo Clicker', descripcion: 'Aprende haciendo click', link: 'https://www.mediafire.com', precio: 10, categorias: ['educativo', 'clicker'], imagenes: ['https://placekitten.com/248/301'] },
            { titulo: 'Multijugador RPG', descripcion: 'Juega con amigos online', link: 'https://www.mediafire.com', precio: 28, categorias: ['multijugador', 'rol'], imagenes: ['https://placekitten.com/249/301'] },
            { titulo: 'Estratégico Tower Defense', descripcion: 'Piensa y defiende', link: 'https://www.mediafire.com', precio: 18, categorias: ['estrategia', 'tower defense'], imagenes: ['https://placekitten.com/250/301'] },
            { titulo: 'Sandbox Fantasia', descripcion: 'Construye mundos magicos', link: 'https://www.mediafire.com', precio: 30, categorias: ['sandbox', 'fantasia'], imagenes: ['https://placekitten.com/251/301'] },
            { titulo: 'Horror Psicologico Retro', descripcion: 'Miedo y nostalgia', link: 'https://www.mediafire.com', precio: 22, categorias: ['terror', 'retro'], imagenes: ['https://placekitten.com/252/301'] },
        ]



        for (const juego of juegos) {
            await prisma.juego.create({
                data: {
                    titulo: juego.titulo,
                    descripcion: juego.descripcion,
                    link: juego.link,
                    precio: juego.precio,
                    usuario: { connect: { id: admin.id } },
                    categorias: {
                        connect: juego.categorias
                            .filter(nombre => categorias.includes(nombre))
                            .map(nombre => ({ nombre }))
                    },
                    imagenes: { create: juego.imagenes.map(href => ({ href })) },
                },
            })
        }

        console.log('usuario admin creado:', admin)
        console.log('categorias insertadas:', categorias.length)
        console.log('juegos publicados:', juegos.length)
    } catch (error) {
        console.error('error creando usuario admin o juegos:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
