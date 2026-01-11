import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Meeting } from './meeting.entity';
import { User } from './user.entity';
import { Team } from './team.entity';

@Entity('meeting_permissions')
export class MeetingPermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Meeting, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'meeting_id' })
  meeting: Meeting;

  @Column()
  meeting_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  user_id: string;

  @ManyToOne(() => Team, { nullable: true })
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @Column({ nullable: true })
  team_id: string;

  @Column()
  permission: string; // 'read', 'write', 'admin'

  @CreateDateColumn()
  created_at: Date;
}

@Entity('meeting_versions')
export class MeetingVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Meeting, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'meeting_id' })
  meeting: Meeting;

  @Column()
  meeting_id: string;

  @Column({ type: 'jsonb' })
  content: any;

  @Column()
  version: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @Column()
  created_by: string;

  @Column({ type: 'text', nullable: true })
  change_description: string;

  @CreateDateColumn()
  created_at: Date;
}

@Entity('meeting_links')
@Unique(['source_meeting_id', 'target_meeting_id'])
export class MeetingLink {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Meeting, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'source_meeting_id' })
  source: Meeting;

  @Column()
  source_meeting_id: string;

  @ManyToOne(() => Meeting, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'target_meeting_id' })
  target: Meeting;

  @Column()
  target_meeting_id: string;

  @CreateDateColumn()
  created_at: Date;
}

@Entity('meeting_participants')
@Unique(['meeting_id', 'user_id'])
export class MeetingParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Meeting, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'meeting_id' })
  meeting: Meeting;

  @Column()
  meeting_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @Column({ default: 'participant' })
  role: string; // 'host', 'participant', 'viewer'
}

@Entity('action_items')
export class ActionItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Meeting, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'meeting_id' })
  meeting: Meeting;

  @Column()
  meeting_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assignee_id' })
  assignee: User;

  @Column({ nullable: true })
  assignee_id: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'date', nullable: true })
  due_date: Date;

  @Column({ default: false })
  completed: boolean;

  @Column({ nullable: true })
  completed_at: Date;

  @CreateDateColumn()
  created_at: Date;
}

@Entity('templates')
export class Template {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'jsonb' })
  content: any;

  @Column({ default: false })
  is_default: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @Column({ nullable: true })
  created_by: string;

  @CreateDateColumn()
  created_at: Date;
}
