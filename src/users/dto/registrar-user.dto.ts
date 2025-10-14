import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { AutenticarUserDtos } from './autenticar-user.dtos';

export class RegistrarUserDto extends AutenticarUserDtos {
   @IsNotEmpty()
   @IsString()
   @IsEmail()
   email: string;
}
