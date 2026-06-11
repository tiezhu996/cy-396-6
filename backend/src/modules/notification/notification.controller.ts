import { Controller, Get, Param, Patch } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @Get('user/:userId')
  getByUser(@Param('userId') userId: string) {
    return this.service.getNotificationsByUser(Number(userId));
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.service.markAsRead(Number(id));
  }
}
