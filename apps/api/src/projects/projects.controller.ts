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
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/guards';
import { Project } from '../entities/meeting.entity';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  async findAll(@Request() req: RequestWithUser) {
    return this.projectsService.findAll(req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Post()
  async create(
    @Request() req: RequestWithUser,
    @Body() body: Partial<Project>,
  ) {
    return this.projectsService.create(req.user.userId, body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Partial<Project>) {
    return this.projectsService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.projectsService.softDelete(id);
  }

  @Post(':id/restore')
  async restore(@Param('id') id: string) {
    return this.projectsService.restore(id);
  }

  @Get('deleted/all')
  async findDeleted() {
    return this.projectsService.getDeletedProjects();
  }
}
