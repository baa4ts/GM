import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class PublicarJuegoDtos {
   @IsString()
   titulo: string;

   @IsString()
   @IsOptional()
   descripcion?: string;

   @IsNumber()
   precio: number;

   @IsArray()
   @IsString({ each: true })
   categorias: string[];

   @IsArray()
   @IsString({ each: true })
   imagenes: string[];
}
