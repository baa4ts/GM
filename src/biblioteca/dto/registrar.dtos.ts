import { IsNotEmpty, ArrayMinSize, IsNumber } from 'class-validator';

export class RegistrarJuegoDtos {
   @IsNotEmpty()
   @IsNumber({}, { each: true })
   @ArrayMinSize(1)
   ids: number[];
}
