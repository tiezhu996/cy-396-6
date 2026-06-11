import { Injectable } from '@nestjs/common';
import { Product, ProductService } from '../product/product.service';

export type TutorialRecommendation = {
  id: number;
  tutorialId: number;
  productId: number;
  productName: string;
  productPrice: number;
  createdAt: Date;
};

@Injectable()
export class RecommendationService {
  private recommendations: TutorialRecommendation[] = [];

  constructor(private readonly productService: ProductService) {}

  async attachProductsToTutorial(tutorialId: number, materialNames: string[]): Promise<TutorialRecommendation[]> {
    const matchedProducts = this.productService.findByMaterialNames(materialNames);
    const createdRecommendations: TutorialRecommendation[] = [];

    for (const product of matchedProducts) {
      const existing = this.recommendations.find(
        (item) => item.tutorialId === tutorialId && item.productId === product.id
      );
      if (!existing) {
        const recommendation: TutorialRecommendation = {
          id: Date.now() + Math.random(),
          tutorialId,
          productId: product.id,
          productName: product.name,
          productPrice: product.price,
          createdAt: new Date(),
        };
        this.recommendations.push(recommendation);
        createdRecommendations.push(recommendation);
      }
    }

    return createdRecommendations;
  }

  getRecommendationsByTutorial(tutorialId: number): TutorialRecommendation[] {
    return this.recommendations.filter((item) => item.tutorialId === tutorialId);
  }

  removeRecommendation(recommendationId: number): boolean {
    const index = this.recommendations.findIndex((item) => item.id === recommendationId);
    if (index === -1) return false;
    this.recommendations.splice(index, 1);
    return true;
  }
}
