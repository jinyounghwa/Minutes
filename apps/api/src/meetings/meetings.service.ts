import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not, ILike } from 'typeorm';

import { Meeting } from '../entities/meeting.entity';
import {
  MeetingLink,
  MeetingVersion,
  MeetingPermission,
  MeetingParticipant,
  ActionItem,
  Template,
} from '../entities/meeting-extras.entity';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(Meeting)
    private meetingsRepository: Repository<Meeting>,
    @InjectRepository(MeetingLink)
    private linksRepository: Repository<MeetingLink>,
  ) {}

  async search(query: string): Promise<Meeting[]> {
    return this.meetingsRepository.find({
      where: [
        { title: ILike(`%${query}%`), deleted_at: IsNull() },
        { content_text: ILike(`%${query}%`), deleted_at: IsNull() },
      ],
      relations: ['project', 'creator'],
    });
  }

  async findAll(userId: string): Promise<Meeting[]> {
    // Basic filter: not deleted, for user
    return this.meetingsRepository.find({
      where: { created_by: userId, deleted_at: IsNull() },
      order: { updated_at: 'DESC' },
      relations: ['project', 'creator'],
    });
  }

  async findOne(id: string): Promise<Meeting> {
    const meeting = await this.meetingsRepository.findOne({
      where: { id, deleted_at: IsNull() },
      relations: ['project', 'creator'],
    });
    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }
    return meeting;
  }

  async create(
    userId: string,
    data: Partial<Meeting> & { team_ids?: string[] },
  ): Promise<Meeting> {
    const { team_ids, ...meetingData } = data;
    const meeting = this.meetingsRepository.create({
      ...meetingData,
      created_by: userId,
    });
    const savedMeeting = await this.meetingsRepository.save(meeting);

    if (team_ids && team_ids.length > 0) {
      const meetingPermissionRepo =
        this.linksRepository.manager.getRepository(MeetingPermission);
      const permissions = team_ids.map((teamId) =>
        meetingPermissionRepo.create({
          meeting_id: savedMeeting.id,
          team_id: teamId,
          permission: 'write',
        }),
      );
      await meetingPermissionRepo.save(permissions);
    }

    return savedMeeting;
  }

  async update(id: string, data: Partial<Meeting>): Promise<Meeting> {
    await this.meetingsRepository.update(id, data);
    return this.findOne(id);
  }

  async softDelete(id: string): Promise<void> {
    await this.meetingsRepository.softDelete(id);
  }

  async permanentDelete(id: string): Promise<void> {
    await this.meetingsRepository.delete(id);
  }

  async getImpactAnalysis(id: string) {
    // Find documents that link TO this meeting
    const inboundLinks = await this.linksRepository.find({
      where: { target_meeting_id: id },
      relations: ['source'],
    });

    return {
      impactedCount: inboundLinks.length,
      impactedMeetings: inboundLinks.map((link) => ({
        id: link.source.id,
        title: link.source.title,
      })),
    };
  }

  async getDeletedMeetings(): Promise<Meeting[]> {
    return this.meetingsRepository.find({
      where: { deleted_at: Not(IsNull()) },
      withDeleted: true,
      relations: ['project', 'creator'],
    });
  }

  async restore(id: string): Promise<void> {
    await this.meetingsRepository.restore(id);
  }

  // Version Control
  async createVersion(
    meetingId: string,
    content: unknown,
    userId: string,
    description?: string,
  ) {
    const meetingVersionRepo =
      this.linksRepository.manager.getRepository(MeetingVersion);
    const latestVersion = await meetingVersionRepo.findOne({
      where: { meeting_id: meetingId },
      order: { version: 'DESC' },
    });

    const nextVersion = (latestVersion?.version || 0) + 1;

    const version = meetingVersionRepo.create({
      meeting_id: meetingId,
      content: content as object,
      version: nextVersion,
      created_by: userId,
      change_description: description,
    });

    return meetingVersionRepo.save(version);
  }

  async getVersions(meetingId: string) {
    return this.linksRepository.manager.getRepository(MeetingVersion).find({
      where: { meeting_id: meetingId },
      order: { version: 'DESC' },
      relations: ['creator'],
    });
  }

  async restoreVersion(meetingId: string, versionId: string) {
    const meetingVersionRepo =
      this.linksRepository.manager.getRepository(MeetingVersion);
    const version = await meetingVersionRepo.findOne({
      where: { id: versionId, meeting_id: meetingId },
    });
    if (!version) throw new NotFoundException('Version not found');

    await this.meetingsRepository.update(meetingId, {
      content: version.content as object,
    });

    return this.findOne(meetingId);
  }

  // Meeting Links
  async createLink(sourceMeetingId: string, targetMeetingId: string) {
    const link = this.linksRepository.create({
      source_meeting_id: sourceMeetingId,
      target_meeting_id: targetMeetingId,
    });
    return this.linksRepository.save(link);
  }

  async deleteLink(sourceMeetingId: string, targetMeetingId: string) {
    await this.linksRepository.delete({
      source_meeting_id: sourceMeetingId,
      target_meeting_id: targetMeetingId,
    });
  }

  async getLinks(meetingId: string) {
    const outboundLinks = await this.linksRepository.find({
      where: { source_meeting_id: meetingId },
      relations: ['target'],
    });
    const inboundLinks = await this.linksRepository.find({
      where: { target_meeting_id: meetingId },
      relations: ['source'],
    });
    return {
      outbound: outboundLinks.map((link) => ({
        id: link.id,
        meetingId: link.target.id,
        title: link.target.title,
      })),
      inbound: inboundLinks.map((link) => ({
        id: link.id,
        meetingId: link.source.id,
        title: link.source.title,
      })),
    };
  }

  // Meeting Participants
  async addParticipant(
    meetingId: string,
    userId: string,
    role: string = 'participant',
  ) {
    const meetingParticipantRepo =
      this.linksRepository.manager.getRepository(MeetingParticipant);
    const existing = await meetingParticipantRepo.findOne({
      where: { meeting_id: meetingId, user_id: userId },
    });
    if (existing) {
      throw new NotFoundException('User is already a participant');
    }
    const participant = meetingParticipantRepo.create({
      meeting_id: meetingId,
      user_id: userId,
      role,
    });
    return meetingParticipantRepo.save(participant);
  }

  async removeParticipant(meetingId: string, userId: string) {
    const meetingParticipantRepo =
      this.linksRepository.manager.getRepository(MeetingParticipant);
    await meetingParticipantRepo.delete({
      meeting_id: meetingId,
      user_id: userId,
    });
  }

  async getParticipants(meetingId: string) {
    const meetingParticipantRepo =
      this.linksRepository.manager.getRepository(MeetingParticipant);
    return meetingParticipantRepo.find({
      where: { meeting_id: meetingId },
      relations: ['user'],
    });
  }

  // Meeting Permissions
  async setPermission(
    meetingId: string,
    userId: string | null,
    teamId: string | null,
    permission: string,
  ) {
    const meetingPermissionRepo =
      this.linksRepository.manager.getRepository(MeetingPermission);
    const permissionData: any = {
      meeting_id: meetingId,
      permission,
    };
    if (userId) permissionData.user_id = userId;
    if (teamId) permissionData.team_id = teamId;

    const permissionEntity = meetingPermissionRepo.create(permissionData);
    return meetingPermissionRepo.save(permissionEntity);
  }

  async removePermission(meetingId: string, permissionId: string) {
    const meetingPermissionRepo =
      this.linksRepository.manager.getRepository(MeetingPermission);
    await meetingPermissionRepo.delete({ id: permissionId });
  }

  async getPermissions(meetingId: string) {
    const meetingPermissionRepo =
      this.linksRepository.manager.getRepository(MeetingPermission);
    return meetingPermissionRepo.find({
      where: { meeting_id: meetingId },
      relations: ['user', 'team'],
    });
  }

  // Action Items
  async createActionItem(meetingId: string, data: Partial<ActionItem>) {
    const actionItemRepo =
      this.linksRepository.manager.getRepository(ActionItem);
    const actionItem = actionItemRepo.create({
      ...data,
      meeting_id: meetingId,
    });
    return actionItemRepo.save(actionItem);
  }

  async updateActionItem(actionItemId: string, data: Partial<ActionItem>) {
    const actionItemRepo =
      this.linksRepository.manager.getRepository(ActionItem);
    await actionItemRepo.update(actionItemId, data);
    return actionItemRepo.findOne({ where: { id: actionItemId } });
  }

  async deleteActionItem(actionItemId: string) {
    const actionItemRepo =
      this.linksRepository.manager.getRepository(ActionItem);
    await actionItemRepo.delete(actionItemId);
  }

  async getActionItems(meetingId: string) {
    const actionItemRepo =
      this.linksRepository.manager.getRepository(ActionItem);
    return actionItemRepo.find({
      where: { meeting_id: meetingId },
      relations: ['assignee', 'meeting'],
      order: { created_at: 'ASC' },
    });
  }

  // Templates
  async createTemplate(userId: string, data: Partial<Template>) {
    const templateRepo = this.linksRepository.manager.getRepository(Template);
    const template = templateRepo.create({
      ...data,
      created_by: userId,
    });
    return templateRepo.save(template);
  }

  async updateTemplate(templateId: string, data: Partial<Template>) {
    const templateRepo = this.linksRepository.manager.getRepository(Template);
    await templateRepo.update(templateId, data);
    return templateRepo.findOne({ where: { id: templateId } });
  }

  async deleteTemplate(templateId: string) {
    const templateRepo = this.linksRepository.manager.getRepository(Template);
    await templateRepo.delete(templateId);
  }

  async getTemplates() {
    const templateRepo = this.linksRepository.manager.getRepository(Template);
    return templateRepo.find({
      relations: ['creator'],
      order: { created_at: 'DESC' },
    });
  }

  async getTemplate(templateId: string) {
    const templateRepo = this.linksRepository.manager.getRepository(Template);
    const template = await templateRepo.findOne({
      where: { id: templateId },
      relations: ['creator'],
    });
    if (!template) {
      throw new NotFoundException('Template not found');
    }
    return template;
  }
}
