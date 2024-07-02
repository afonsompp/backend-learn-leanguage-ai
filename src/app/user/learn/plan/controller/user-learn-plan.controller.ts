import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LearnPlansService } from '@app/user/learn/plan/service/user-learn-plan.service';
import { LearnPlanDto } from '@app/user/learn/plan/dto/learn-plan.dto';
import { CreateLearnPlanDto } from '@app/user/learn/plan/dto/create-learn-plan.dto';
import { UserRequest } from '@core/security/auth/entity/user-request.interface';
import { AuthGuard } from '@nestjs/passport';
import { ScopesGuard } from '@core/security/scopes/scopes.guard';

@Controller('learnPlans')
export class LearnPlansController {
  constructor(private readonly learnPlansService: LearnPlansService) {}

  @Get()
  @UseGuards(AuthGuard('bearer'), ScopesGuard)
  async findAll(@Req() req: UserRequest): Promise<LearnPlanDto[]> {
    return this.learnPlansService.findAll(req.user.sub);
  }

  @Get(':id')
  @UseGuards(AuthGuard('bearer'), ScopesGuard)
  async findOne(
    @Req() req: UserRequest,
    @Param('id') id: string,
  ): Promise<LearnPlanDto> {
    const learnPlan = await this.learnPlansService.findOne(id, req.user.sub);
    if (!learnPlan) {
      throw new NotFoundException(`Learn plan with id ${id} not found`);
    }
    return new LearnPlanDto(learnPlan);
  }

  @Post()
  @UseGuards(AuthGuard('bearer'), ScopesGuard)
  async create(
    @Req() req: UserRequest,
    @Body() createLearnPlanDto: CreateLearnPlanDto,
  ): Promise<LearnPlanDto> {
    createLearnPlanDto.userId = req.user.sub;
    return this.learnPlansService.create(createLearnPlanDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('bearer'), ScopesGuard)
  async delete(
    @Req() req: UserRequest,
    @Param('id') id: string,
  ): Promise<void> {
    return this.learnPlansService.delete(id, req.user.sub);
  }
}
