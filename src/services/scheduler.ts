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

  // Schedule daily updates (at 10 AM)
  cron.schedule('0 10 * * *', async () => {
    console.log('Running daily weather updates');
    await sendWeatherUpdates('daily');
  });
};

async function sendWeatherUpdates(
  frequency: 'hourly' | 'daily',
): Promise<void> {
  try {
    const subscriptions =
      await Subscription.getConfirmedSubscriptions(frequency);

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
