import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { ScopesGuard } from '@core/security/scopes/scopes.guard';
import { UserRequest } from '@core/security/auth/entity/user-request.interface';
import { UserProfileService } from '@app/user/profiles/service/user-profile.service';
import { ProfileDto } from '@app/user/profiles/dto/profile.dto';
import { UpdateProfileDto } from '@app/user/profiles/dto/update-profile.dto';

@Controller('profiles')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Post()
  @UseGuards(AuthGuard('bearer'), ScopesGuard)
  async create(
    @Req() req: UserRequest,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    createProfileDto.idProvider = req.user.sub;

    return this.userProfileService.create(createProfileDto);
  }

  @Put()
  @UseGuards(AuthGuard('bearer'), ScopesGuard)
  async update(
    @Req() req: UserRequest,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileDto> {
    return await this.userProfileService.update(req.user.sub, updateProfileDto);
  }

  @Get()
  @UseGuards(AuthGuard('bearer'), ScopesGuard)
  async findOne(@Req() req: UserRequest): Promise<ProfileDto> {
    try {
      return await this.userProfileService.findOne(req.user.sub);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this.userProfileService.delete(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
