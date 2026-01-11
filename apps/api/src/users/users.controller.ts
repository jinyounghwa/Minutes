import { Controller, Get, Query, UseGuards, Put, Body, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('search')
  async search(@Query('q') query: string) {
    return this.usersService.search(query || '');
  }

  @Put('me')
  async updateMe(@Request() req: any, @Body() body: any) {
    return this.usersService.update(req.user.userId, body);
  }
}
