import { Request, Response } from 'express';
import SubscriptionModel, {
  SubscriptionFrequency,
} from '#models/subscriptionModel';
import emailService from '#services/emailService';
import { weatherService } from '#services/weatherService';

export const subscribe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, city, frequency } = req.body;

    if (!email || !city || !frequency) {
      res.status(400).json('Invalid input');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json('Invalid input');
      return;
    }

    if (
      frequency !== SubscriptionFrequency.HOURLY &&
      frequency !== SubscriptionFrequency.DAILY
    ) {
      res.status(400).json('Invalid input');
      return;
    }

    const weatherResult = await weatherService.getWeatherByCity(city);

    if (!weatherResult.success && weatherResult.statusCode === 404) {
      res.status(404).json('Invalid input: city not found');
      return;
    }

    if (!weatherResult.success) {
      res.status(weatherResult.statusCode).json('Internal Server Error');
      return;
    }

    const existingSubscription = await SubscriptionModel.findByEmailAndCity(
      email,
      city,
    );
    if (existingSubscription) {
      res.status(409).json('Email already subscribed');
      return;
    }

    const subscription = await SubscriptionModel.create({
      email,
      city,
      frequency: frequency as SubscriptionFrequency,
    });

    const capitalizeCity = city.charAt(0).toUpperCase() + city.slice(1);
    const capitalizeFrequency =
      frequency.charAt(0).toUpperCase() + frequency.slice(1);

    try {
      await emailService.sendConfirmationEmail(
        email,
        capitalizeCity,
        capitalizeFrequency,
        subscription.confirmation_token!,
      );
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      await SubscriptionModel.deleteSubscription(subscription.id!);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    res
      .status(200)
      .json('Subscription successful. Confirmation email sent.');
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const confirmSubscription = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { token } = req.params;

    if (!token) {
      res.status(400).json('Invalid token');
      return;
    }

    const subscription = await SubscriptionModel.findByConfirmationToken(token);
    if (!subscription) {
      res.status(404).json('Token not found');
      return;
    }

    await SubscriptionModel.confirmSubscription(subscription.id!);

    res.status(200).json('Subscription confirmed successfully');
  } catch (error) {
    console.error('Error confirming subscription:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const unsubscribe = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { token } = req.params;

    if (!token) {
      res.status(400).json('Token is required');
      return;
    }

    const subscription = await SubscriptionModel.findByUnsubscribeToken(token);
    if (!subscription) {
      res.status(404).json('Token not found');
      return;
    }

    await SubscriptionModel.deleteSubscription(subscription.id!);

    res.status(200).json('Unsubscribed successfully');
  } catch (error) {
    console.error('Error unsubscribing:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
