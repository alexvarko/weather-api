import { db } from '#database/database';
import crypto from 'crypto';

export enum SubscriptionFrequency {
  HOURLY = 'hourly',
  DAILY = 'daily',
}

export interface Subscription {
  id?: number;
  email: string;
  city: string;
  frequency: SubscriptionFrequency;
  confirmed: boolean;
  confirmation_token?: string;
  unsubscribe_token?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateSubscriptionData {
  email: string;
  city: string;
  frequency: SubscriptionFrequency;
}

export class SubscriptionModel {
  private tableName = 'subscriptions';

  async create(data: CreateSubscriptionData): Promise<Subscription> {
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    const unsubscribeToken = crypto.randomBytes(32).toString('hex');

    const newSubscription = {
      email: data.email,
      city: data.city,
      frequency: data.frequency,
      confirmed: false,
      confirmation_token: confirmationToken,
      unsubscribe_token: unsubscribeToken,
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    };

    const [createdSubscription] = await db(this.tableName)
      .insert(newSubscription)
      .returning('*');

    return createdSubscription;
  }

  async findByEmailAndCity(
    email: string,
    city: string,
  ): Promise<Subscription | null> {
    return db(this.tableName).where({ email, city }).first();
  }

  async findByConfirmationToken(token: string): Promise<Subscription | null> {
    return db(this.tableName).where({ confirmation_token: token }).first();
  }

  async findByUnsubscribeToken(token: string): Promise<Subscription | null> {
    return db(this.tableName).where({ unsubscribe_token: token }).first();
  }

  async confirmSubscription(id: number): Promise<Subscription | null> {
    const [updatedSubscription] = await db(this.tableName)
      .where({ id })
      .update({
        confirmed: true,
        confirmation_token: null,
        updated_at: db.fn.now(),
      })
      .returning('*');
    return updatedSubscription;
  }

  async deleteSubscription(id: number): Promise<void> {
    await db(this.tableName).where({ id }).delete();
  }

  async getConfirmedSubscriptions(
    frequency: 'hourly' | 'daily',
  ): Promise<Subscription[]> {
    return db(this.tableName).where({ confirmed: true, frequency });
  }
}

export default new SubscriptionModel;
