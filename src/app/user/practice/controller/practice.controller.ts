import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { UserRequest } from '@core/security/auth/entity/user-request.interface';
import { PracticeDto } from '@app/user/practice/dto/pratice/practice.dto';
import { PracticeService } from '@app/user/practice/service/practice.service';
import { CreatePracticeDto } from '@app/user/practice/dto/pratice/create-practice.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('practices')
@ApiBearerAuth()
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

  @Post()
  async create(
    @Req() req: UserRequest,
    @Param('learnPlanId') learnPlanId: string,
    @Body() createPracticeDto: CreatePracticeDto,
  ) {
    const practice = await this.practiceService.create(
      createPracticeDto,
      learnPlanId,
      req.user.sub,
    );
    return new PracticeDto(practice);
  }

  @Get()
  async findAllByLearnPlan(
    @Req() req: UserRequest,
    @Param('learnPlanId') learnPlanId: string,
  ) {
    const practices = await this.practiceService.findAllByLearnPlan(
      learnPlanId,
      req.user.sub,
    );
    return practices.map((practice) => new PracticeDto(practice));
  }

  @Get(':id')
  async findById(
    @Req() req: UserRequest,
    @Param('learnPlanId') learnPlanId: string,
    @Param('id') id: string,
  ) {
    const practice = await this.practiceService.findOneByIdAndLearnPlan(
      id,
      learnPlanId,
      req.user.sub,
    );
    return new PracticeDto(practice);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(
    @Req() req: UserRequest,
    @Param('learnPlanId') learnPlanId: string,
    @Param('id') id: string,
  ) {
    return this.practiceService.delete(id, learnPlanId, req.user.sub);
  }
}
