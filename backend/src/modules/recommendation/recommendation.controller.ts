import { Controller, Delete, Get, Param } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';

@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly service: RecommendationService) {}

  @Get('tutorial/:tutorialId')
  getByTutorial(@Param('tutorialId') tutorialId: string) {
    return this.service.getRecommendationsByTutorial(Number(tutorialId));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return { success: this.service.removeRecommendation(Number(id)) };
  }
}
