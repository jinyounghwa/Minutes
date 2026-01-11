import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { JwtAuthGuard } from '../auth/guards';
import { Team } from '../entities/team.entity';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @Get()
  async findAll() {
    return this.teamsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.teamsService.findOne(id);
  }

  @Get(':id/members')
  async getMembers(@Param('id') id: string) {
    return this.teamsService.getTeamMembers(id);
  }

  @Post()
  async create(@Request() req: RequestWithUser, @Body() body: Partial<Team>) {
    return this.teamsService.create(req.user.userId, body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Partial<Team>) {
    return this.teamsService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.teamsService.softDelete(id);
  }

  @Post(':id/restore')
  async restore(@Param('id') id: string) {
    return this.teamsService.restore(id);
  }

  // Team Members Management
  @Post(':id/members')
  async addMember(
    @Param('id') teamId: string,
    @Body() body: { user_id: string; role?: string },
  ) {
    return this.teamsService.addMember(teamId, body.user_id, body.role);
  }

  @Delete(':id/members/:userId')
  async removeMember(
    @Param('id') teamId: string,
    @Param('userId') userId: string,
  ) {
    return this.teamsService.removeMember(teamId, userId);
  }

  @Put(':id/members/:userId')
  async updateMemberRole(
    @Param('id') teamId: string,
    @Param('userId') userId: string,
    @Body() body: { role: string },
  ) {
    return this.teamsService.updateMemberRole(teamId, userId, body.role);
  }
}
