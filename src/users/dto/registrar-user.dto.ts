import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegistrarUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
