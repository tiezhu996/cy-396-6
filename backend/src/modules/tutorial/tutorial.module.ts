import { Module } from '@nestjs/common';
import { NotificationModule } from '../notification/notification.module';
import { RecommendationModule } from '../recommendation/recommendation.module';
import { TutorialController } from './tutorial.controller';
import { TutorialService } from './tutorial.service';

@Module({
  imports: [NotificationModule, RecommendationModule],
  controllers: [TutorialController],
  providers: [TutorialService],
  exports: [TutorialService],
})
export class TutorialModule {}
