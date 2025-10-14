import { Module } from '@nestjs/common';
import { ProviderJwtService } from './provider-jwt.service';

@Module({
   exports: [ProviderJwtModule],
   providers: [ProviderJwtService],
})
export class ProviderJwtModule {}
