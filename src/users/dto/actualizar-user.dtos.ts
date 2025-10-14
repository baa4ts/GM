import { IsOptional, IsString, IsUrl, IsEmail } from 'class-validator';

export class ActualizarUserDto {
   @IsOptional()
   @IsString()
   bio?: string;

   @IsOptional()
   @IsUrl()
   icon?: string;

   @IsOptional()
   @IsUrl()
   banner?: string;
}
