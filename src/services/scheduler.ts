import cron from 'node-cron';
import Subscription from '#/models/subscriptionModel';

import emailService from '#/services/emailService';
import { weatherService } from '#/services/weatherService';

export const scheduleTasks = (): void => {
  // Schedule hourly updates
  cron.schedule('0 * * * *', async () => {
    console.log('Running hourly weather updates');
    await sendWeatherUpdates('hourly');
  });

  // Schedule daily updates (at 10 AM UTC+3)
  cron.schedule('0 7 * * *', async () => {
    console.log('Running daily weather updates');
    await sendWeatherUpdates('daily');
  });

  // Minute-based updates for testing (only for Lviv Hourly subscriptions)
  cron.schedule('* * * * *', async () => {
    console.log('Running minute-based weather updates for Lviv');
    await sendWeatherUpdates('minute');
  });
};

async function sendWeatherUpdates(
  frequency: 'hourly' | 'daily' | 'minute',
): Promise<void> {
  try {
    let subscriptions = await Subscription.getConfirmedSubscriptions(
      frequency === 'minute' ? 'hourly' : frequency,
    );

    if (frequency === 'minute') {
      subscriptions = subscriptions.filter(sub => sub.city.toLowerCase() === 'lviv');
    }

    for (const subscription of subscriptions) {
      try {
        const weather = await weatherService.getWeatherByCity(
          subscription.city,
        );

        await emailService.sendWeatherUpdate(
          subscription.email,
          subscription.city,
          weather.data!,
          frequency.charAt(0).toUpperCase() + frequency.slice(1),
          subscription.unsubscribe_token!,
        );
      } catch (error) {
        console.error(
          `Failed to send weather update to ${subscription.email} for ${subscription.city}:`,
          error,
        );
      }
    }
  } catch (error) {
    console.error('Error sending scheduled weather updates:', error);
  }
}
