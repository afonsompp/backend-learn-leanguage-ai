import { PartialType } from '@nestjs/mapped-types';
import { CreatePracticeTypeDto } from './create-practice-type.dto';

export class UpdatePracticeTypeDto extends PartialType(CreatePracticeTypeDto) {}
