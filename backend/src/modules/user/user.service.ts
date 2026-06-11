import { Injectable } from '@nestjs/common';

export type Follower = { userId: number; authorId: number };
export type Favorite = { userId: number; targetType: 'tutorial' | 'product'; targetId: number };

@Injectable()
export class UserService {
  private follows: Follower[] = [];
  private favorites: Favorite[] = [];

  follow(userId: number, authorId: number) {
    this.follows.push({ userId, authorId });
    return { userId, authorId, message: '关注成功' };
  }

  favorite(userId: number, targetType: 'tutorial' | 'product', targetId: number) {
    this.favorites.push({ userId, targetType, targetId });
    return { userId, targetType, targetId, message: '收藏成功' };
  }

  feed(userId: number) {
    return { follows: this.follows.filter((item) => item.userId === userId), latest: ['作者发布了新的皮具教程', '收藏商品库存已更新'] };
  }

  getFollowers(authorId: number): number[] {
    return this.follows.filter((item) => item.authorId === authorId).map((item) => item.userId);
  }
}
