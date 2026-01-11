import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Team, TeamMember } from '../entities/team.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
    @InjectRepository(TeamMember)
    private teamMembersRepository: Repository<TeamMember>,
  ) {}

  async findAll(): Promise<Team[]> {
    return this.teamsRepository.find({
      where: { deleted_at: IsNull() },
      relations: ['leader', 'members', 'members.user'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Team> {
    const team = await this.teamsRepository.findOne({
      where: { id, deleted_at: IsNull() },
      relations: ['leader', 'members', 'members.user'],
    });
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    return team;
  }

  async create(userId: string, data: Partial<Team>): Promise<Team> {
    const team = this.teamsRepository.create({
      ...data,
      leader_id: userId,
    });
    const savedTeam = await this.teamsRepository.save(team);
    
    // Add the creator as a team member with leader role
    await this.teamMembersRepository.save({
      team_id: savedTeam.id,
      user_id: userId,
      role: 'leader',
    });
    
    return savedTeam;
  }

  async update(id: string, data: Partial<Team>): Promise<Team> {
    await this.teamsRepository.update(id, data);
    return this.findOne(id);
  }

  async softDelete(id: string): Promise<void> {
    await this.teamsRepository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    await this.teamsRepository.restore(id);
  }

  // Team Members Management
  async addMember(teamId: string, userId: string, role: string = 'member'): Promise<TeamMember> {
    const existing = await this.teamMembersRepository.findOne({
      where: { team_id: teamId, user_id: userId },
    });
    if (existing) {
      throw new Error('User is already a member of this team');
    }
    
    const member = this.teamMembersRepository.create({
      team_id: teamId,
      user_id: userId,
      role,
    });
    return this.teamMembersRepository.save(member);
  }

  async removeMember(teamId: string, userId: string): Promise<void> {
    await this.teamMembersRepository.delete({
      team_id: teamId,
      user_id: userId,
    });
  }

  async updateMemberRole(teamId: string, userId: string, role: string): Promise<TeamMember> {
    const member = await this.teamMembersRepository.findOne({
      where: { team_id: teamId, user_id: userId },
    });
    if (!member) {
      throw new NotFoundException('Team member not found');
    }
    member.role = role;
    return this.teamMembersRepository.save(member);
  }

  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    return this.teamMembersRepository.find({
      where: { team_id: teamId },
      relations: ['user', 'team'],
    });
  }
}
