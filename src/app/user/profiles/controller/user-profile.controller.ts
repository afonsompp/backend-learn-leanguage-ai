import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { UserRequest } from '@core/security/auth/entity/user-request.interface';
import { UserProfileService } from '@app/user/profiles/service/user-profile.service';
import { ProfileDto } from '@app/user/profiles/dto/profile.dto';
import { UpdateProfileDto } from '@app/user/profiles/dto/update-profile.dto';
import { CreateProfileDto } from '@app/user/profiles/dto/create-profile.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('profiles')
@ApiBearerAuth()
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Post()
  async create(
    @Req() req: UserRequest,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    createProfileDto.userId = req.user.sub;

    return this.userProfileService.create(createProfileDto);
  }

  @Patch()
  async update(
    @Req() req: UserRequest,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileDto> {
    return await this.userProfileService.update(req.user.sub, updateProfileDto);
  }

  @Get()
  async findOne(@Req() req: UserRequest): Promise<ProfileDto> {
    const profile = await this.userProfileService.findOne(req.user.sub);
    return new ProfileDto(profile);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    await this.userProfileService.delete(id);
  }
}
