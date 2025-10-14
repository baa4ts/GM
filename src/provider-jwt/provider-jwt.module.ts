import { Module } from '@nestjs/common';
import { ProviderJwtService } from './provider-jwt.service';

@Module({
   exports: [ProviderJwtService],
   providers: [ProviderJwtService],
})
export class ProviderJwtModule {}
