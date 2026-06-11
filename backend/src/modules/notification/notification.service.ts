import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

export type NotificationType = 'tutorial_published';

export type TutorialPublishedNotificationPayload = {
  tutorialId: number;
  tutorialTitle: string;
  authorId: number;
};

export type Notification = {
  id: number;
  type: NotificationType;
  userId: number;
  payload: TutorialPublishedNotificationPayload;
  read: boolean;
  createdAt: Date;
};

@Injectable()
export class NotificationService {
  private notifications: Notification[] = [];

  constructor(private readonly userService: UserService) {}

  async notifyFollowersOnTutorialPublish(tutorialId: number, tutorialTitle: string, authorId: number): Promise<Notification[]> {
    const followerIds = this.userService.getFollowers(authorId);
    const createdNotifications: Notification[] = [];

    for (const userId of followerIds) {
      const notification: Notification = {
        id: Date.now() + Math.random(),
        type: 'tutorial_published',
        userId,
        payload: { tutorialId, tutorialTitle, authorId },
        read: false,
        createdAt: new Date(),
      };
      this.notifications.push(notification);
      createdNotifications.push(notification);
    }

    return createdNotifications;
  }

  getNotificationsByUser(userId: number): Notification[] {
    return this.notifications.filter((item) => item.userId === userId);
  }

  markAsRead(notificationId: number): Notification | null {
    const notification = this.notifications.find((item) => item.id === notificationId);
    if (!notification) return null;
    notification.read = true;
    return notification;
  }
}
