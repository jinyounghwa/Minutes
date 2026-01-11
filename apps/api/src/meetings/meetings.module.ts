import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingsService } from './meetings.service';
import { MeetingsController } from './meetings.controller';
import { Meeting } from '../entities/meeting.entity';
import {
  MeetingLink,
  MeetingVersion,
  MeetingPermission,
  MeetingParticipant,
  ActionItem,
} from '../entities/meeting-extras.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Meeting,
      MeetingLink,
      MeetingVersion,
      MeetingPermission,
      MeetingParticipant,
      ActionItem,
    ]),
  ],
  providers: [MeetingsService],
  controllers: [MeetingsController],
  exports: [MeetingsService],
})
export class MeetingsModule {}
