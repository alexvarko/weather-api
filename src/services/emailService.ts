import nodemailer from 'nodemailer';
import config from '#config/config';
import { Weather } from '#models/weatherModel';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: config.email.smtp.host,
      port: config.email.smtp.port,
      secure: true,
      auth: {
        user: config.email.smtp.auth.user,
        pass: config.email.smtp.auth.pass,
      },
    });
  }

  async sendConfirmationEmail(
    email: string,
    city: string,
    frequency: string,
    token: string,
  ): Promise<void> {
    const confirmUrl = `${config.hostUrl}/api/confirm/${token}`;

    await this.transporter.sendMail({
      from: config.email.from,
      to: email,
      subject: 'Confirm Your Weather Subscription',
      html: `
        <h1>Confirm Your Weather Subscription</h1>
        <p>Please click the link below to confirm your <b>${frequency}</b> subscription on weather updates for <b>${city}</b>:</p>
        <a href="${confirmUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Confirm Subscription</a>
        <p>If you didn't request this subscription, you can ignore this email.</p>
      `,
    });
  }

  async sendWeatherUpdate(
    email: string,
    city: string,
    weather: Weather,
    frequency: string,
    unsubscribeToken: string,
  ): Promise<void> {
    const unsubscribeUrl = `${config.hostUrl}/api/unsubscribe/${unsubscribeToken}`;

    await this.transporter.sendMail({
      from: config.email.from,
      to: email,
      subject: `Weather Update for ${city}`,
      html: `
        <h1>${frequency} Weather Update for ${city}</h1>
        <div style="padding: 20px; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 20px;">
          <p><strong>Temperature:</strong> ${weather.temperature}°C</p>
          <p><strong>Humidity:</strong> ${weather.humidity}%</p>
          <p><strong>Description:</strong> ${weather.description}</p>
        </div>
        <p>To unsubscribe from these updates, <a href="${unsubscribeUrl}">click here</a>.</p>
      `,
    });
  }
}

export default new EmailService();
