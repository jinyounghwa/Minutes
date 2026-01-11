import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, ILike } from 'typeorm';
import { Project } from '../entities/meeting.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async findAll(userId: string): Promise<Project[]> {
    return this.projectsRepository.find({
      where: { deleted_at: IsNull() },
      relations: ['team', 'owner'],
      order: { updated_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id, deleted_at: IsNull() },
      relations: ['team', 'owner', 'meetings'],
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async create(userId: string, data: Partial<Project>): Promise<Project> {
    const project = this.projectsRepository.create({
      ...data,
      owner_id: userId,
    });
    return this.projectsRepository.save(project);
  }

  async update(id: string, data: Partial<Project>): Promise<Project> {
    await this.projectsRepository.update(id, data);
    return this.findOne(id);
  }

  async softDelete(id: string): Promise<void> {
    await this.projectsRepository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    await this.projectsRepository.restore(id);
  }

  async getDeletedProjects(): Promise<Project[]> {
    return this.projectsRepository.find({
      where: { deleted_at: IsNull() },
      withDeleted: true,
      relations: ['team', 'owner'],
    });
  }
}
