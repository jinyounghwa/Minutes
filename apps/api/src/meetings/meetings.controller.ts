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

import { MeetingsService } from './meetings.service';
import { JwtAuthGuard } from '../auth/guards';
import { Meeting } from '../entities/meeting.entity';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

@Controller('meetings')
@UseGuards(JwtAuthGuard)
export class MeetingsController {
  constructor(private meetingsService: MeetingsService) {}

  @Get()
  async findAll(@Request() req: RequestWithUser) {
    return this.meetingsService.findAll(req.user.userId);
  }

  @Get('search')
  async search(@Query('q') query: string) {
    return this.meetingsService.search(query);
  }

  @Get('trash')
  async findTrash() {
    return this.meetingsService.getDeletedMeetings();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.meetingsService.findOne(id);
  }

  @Get(':id/impact')
  async getImpact(@Param('id') id: string) {
    return this.meetingsService.getImpactAnalysis(id);
  }

  @Post()
  async create(
    @Request() req: RequestWithUser,
    @Body() body: Partial<Meeting>,
  ) {
    return this.meetingsService.create(req.user.userId, body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Partial<Meeting>) {
    return this.meetingsService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.meetingsService.softDelete(id);
  }

  @Post(':id/restore')
  async restore(@Param('id') id: string) {
    return this.meetingsService.restore(id);
  }

  // Version Control
  @Get(':id/versions')
  async getVersions(@Param('id') id: string) {
    return this.meetingsService.getVersions(id);
  }

  @Post(':id/versions')
  async createVersion(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
    @Body() body: { content: any; description?: string },
  ) {
    return this.meetingsService.createVersion(
      id,
      body.content,
      req.user.userId,
      body.description,
    );
  }

  @Post(':id/versions/:versionId/restore')
  async restoreVersion(
    @Param('id') id: string,
    @Param('versionId') versionId: string,
  ) {
    return this.meetingsService.restoreVersion(id, versionId);
  }

  // Meeting Links
  @Post(':id/links')
  async createLink(
    @Param('id') id: string,
    @Body() body: { target_meeting_id: string },
  ) {
    return this.meetingsService.createLink(id, body.target_meeting_id);
  }

  @Delete(':id/links/:targetId')
  async deleteLink(
    @Param('id') id: string,
    @Param('targetId') targetId: string,
  ) {
    return this.meetingsService.deleteLink(id, targetId);
  }

  @Get(':id/links')
  async getLinks(@Param('id') id: string) {
    return this.meetingsService.getLinks(id);
  }

  // Meeting Participants
  @Post(':id/participants')
  async addParticipant(
    @Param('id') id: string,
    @Body() body: { user_id: string; role?: string },
  ) {
    return this.meetingsService.addParticipant(id, body.user_id, body.role);
  }

  @Delete(':id/participants/:userId')
  async removeParticipant(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return this.meetingsService.removeParticipant(id, userId);
  }

  @Get(':id/participants')
  async getParticipants(@Param('id') id: string) {
    return this.meetingsService.getParticipants(id);
  }

  // Meeting Permissions
  @Post(':id/permissions')
  async setPermission(
    @Param('id') id: string,
    @Body() body: { user_id?: string; team_id?: string; permission: string },
  ) {
    return this.meetingsService.setPermission(id, body.user_id, body.team_id, body.permission);
  }

  @Delete(':id/permissions/:permissionId')
  async removePermission(
    @Param('id') id: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.meetingsService.removePermission(id, permissionId);
  }

  @Get(':id/permissions')
  async getPermissions(@Param('id') id: string) {
    return this.meetingsService.getPermissions(id);
  }

  // Action Items
  @Post(':id/action-items')
  async createActionItem(
    @Param('id') id: string,
    @Body() body: Partial<any>,
  ) {
    return this.meetingsService.createActionItem(id, body);
  }

  @Put('action-items/:itemId')
  async updateActionItem(
    @Param('itemId') itemId: string,
    @Body() body: Partial<any>,
  ) {
    return this.meetingsService.updateActionItem(itemId, body);
  }

  @Delete('action-items/:itemId')
  async deleteActionItem(@Param('itemId') itemId: string) {
    return this.meetingsService.deleteActionItem(itemId);
  }

  @Get(':id/action-items')
  async getActionItems(@Param('id') id: string) {
    return this.meetingsService.getActionItems(id);
  }

  // Templates
  @Get('templates/all')
  async getTemplates() {
    return this.meetingsService.getTemplates();
  }

  @Get('templates/:templateId')
  async getTemplate(@Param('templateId') templateId: string) {
    return this.meetingsService.getTemplate(templateId);
  }

  @Post('templates')
  async createTemplate(
    @Request() req: RequestWithUser,
    @Body() body: Partial<any>,
  ) {
    return this.meetingsService.createTemplate(req.user.userId, body);
  }

  @Put('templates/:templateId')
  async updateTemplate(
    @Param('templateId') templateId: string,
    @Body() body: Partial<any>,
  ) {
    return this.meetingsService.updateTemplate(templateId, body);
  }

  @Delete('templates/:templateId')
  async deleteTemplate(@Param('templateId') templateId: string) {
    return this.meetingsService.deleteTemplate(templateId);
  }
}
