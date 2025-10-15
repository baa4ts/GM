import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PublicarJuegoDtos {
   @IsString()
   titulo: string;

   @IsString()
   @IsOptional()
   descripcion?: string;

   @IsString()
   @IsNotEmpty()
   link: string;

   @IsNumber()
   precio: number;

   @IsArray()
   @IsString({ each: true })
   categorias: string[];

   @IsArray()
   @IsString({ each: true })
   imagenes: string[];
}
