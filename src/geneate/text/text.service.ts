import { Injectable } from '@nestjs/common';

@Injectable()
export class TextService {
  create() {
    return 'This action adds a new text';
  }

  findAll() {
    return `This action returns all text`;
  }

  findOne(id: number) {
    return `This action returns a #${id} text`;
  }

  remove(id: number) {
    return `This action removes a #${id} text`;
  }
}
