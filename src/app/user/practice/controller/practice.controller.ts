import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserRequest } from '@core/security/auth/entity/user-request.interface';
import { AuthGuard } from '@nestjs/passport';
import { ScopesGuard } from '@core/security/scopes/scopes.guard';
import { PracticeDto } from '@app/user/practice/dto/pratice/practice.dto';
import { PracticeService } from '@app/user/practice/service/practice.service';
import { CreatePracticeDto } from '@app/user/practice/dto/pratice/create-practice.dto';

@Controller('practices')
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

  @Post()
  @UseGuards(AuthGuard('bearer'), ScopesGuard)
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
  @UseGuards(AuthGuard('bearer'), ScopesGuard)
  async findAllByLearnPlan(
    @Req() req: UserRequest,
    @Param('learnPlanId') learnPlanId: string,
  ) {
    const practices = await this.practiceService.findAllByPlan(
      learnPlanId,
      req.user.sub,
    );
    return practices.map((practice) => new PracticeDto(practice));
  }

  @Get(':id')
  @UseGuards(AuthGuard('bearer'), ScopesGuard)
  async findById(
    @Req() req: UserRequest,
    @Param('learnPlanId') learnPlanId: string,
    @Param('id') id: string,
  ) {
    const practice = await this.practiceService.findOneById(
      id,
      learnPlanId,
      req.user.sub,
    );
    return new PracticeDto(practice);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('bearer'), ScopesGuard)
  remove(
    @Req() req: UserRequest,
    @Param('learnPlanId') learnPlanId: string,
    @Param('id') id: string,
  ) {
    return this.practiceService.delete(id, learnPlanId, req.user.sub);
  }
}
