import { Injectable } from '@nestjs/common';
import { TutorialStatus } from '../../constants/enums';
import { NotificationService, Notification } from '../notification/notification.service';
import { RecommendationService, TutorialRecommendation } from '../recommendation/recommendation.service';

export type Tutorial = { id: number; title: string; category: string; difficulty: string; status: TutorialStatus; materials: string[]; steps: string[]; views: number; favorites: number; authorId: number };

export type TutorialPublishResult = {
  tutorial: Tutorial;
  notifications: Notification[];
  recommendations: TutorialRecommendation[];
};

@Injectable()
export class TutorialService {
  private tutorials: Tutorial[] = [
    { id: 1, title: '入门编织杯垫', category: 'knitting', difficulty: 'beginner', status: TutorialStatus.Published, materials: ['棉线', '钩针'], steps: ['起针', '钩织主体', '收边'], views: 210, favorites: 32, authorId: 101 },
  ];

  constructor(
    private readonly notificationService: NotificationService,
    private readonly recommendationService: RecommendationService,
  ) {}

  create(payload: Omit<Tutorial, 'id' | 'views' | 'favorites'>) {
    const tutorial = { ...payload, id: Date.now(), views: 0, favorites: 0 };
    this.tutorials.push(tutorial);
    return tutorial;
  }

  search(query: { category?: string; difficulty?: string; keyword?: string }) {
    return this.tutorials.filter((item) => (!query.category || item.category === query.category) && (!query.difficulty || item.difficulty === query.difficulty) && (!query.keyword || item.title.includes(query.keyword)));
  }

  async publish(id: number): Promise<TutorialPublishResult | null> {
    const tutorial = this.tutorials.find((item) => item.id === id);
    if (!tutorial) return null;

    tutorial.status = TutorialStatus.Published;

    const notifications = await this.notificationService.notifyFollowersOnTutorialPublish(
      tutorial.id,
      tutorial.title,
      tutorial.authorId,
    );

    const recommendations = await this.recommendationService.attachProductsToTutorial(
      tutorial.id,
      tutorial.materials,
    );

    return { tutorial, notifications, recommendations };
  }

  updateStatus(id: number, status: TutorialStatus): Tutorial | null {
    const tutorial = this.tutorials.find((item) => item.id === id);
    if (!tutorial) return null;
    tutorial.status = status;
    return tutorial;
  }

  hot() {
    return [...this.tutorials].sort((a, b) => b.views + b.favorites - (a.views + a.favorites)).slice(0, 10);
  }
}
