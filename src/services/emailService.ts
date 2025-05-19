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
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <h1 style="color: #333333; margin-top: 0;">${frequency} Weather Update for ${city}</h1>
        <div style="margin-top: 20px; padding: 20px; background-color: #f1f8ff; border-left: 5px solid #2196F3; border-radius: 4px;">
          <p style="margin: 10px 0; font-size: 16px;"><strong>🌡️ Temperature:</strong> ${weather.temperature}°C</p>
          <p style="margin: 10px 0; font-size: 16px;"><strong>💧 Humidity:</strong> ${weather.humidity}%</p>
          <p style="margin: 10px 0; font-size: 16px;"><strong>🌥️ Description:</strong> ${weather.description}</p>
        </div>
        <p style="margin-top: 30px; font-size: 14px; color: #666666;">
          If you no longer wish to receive these updates, you can <a href="${unsubscribeUrl}" style="color: #2196F3;">unsubscribe here</a>.
        </p>
      </div>
    </div>
      `,
    });
  }
}

export default new EmailService();
