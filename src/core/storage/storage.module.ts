import { Module } from '@nestjs/common';
import { DatabaseModule } from '@core/storage/database/database.module';
import { BlobModule } from './blob/blob.module';

@Module({
  imports: [DatabaseModule, BlobModule],
})
export class StorageModule {}
