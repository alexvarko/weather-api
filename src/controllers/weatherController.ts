import { Request, Response } from 'express';
import { weatherService } from '#services/weatherService';

export const getWeather = async (req: Request, res: Response) => {
  const city = req.query.city;

  try {
    const result = await weatherService.getWeatherByCity(city as string);

    if (!result.success) {
      return res.status(result.statusCode).json(result.error);
    }

    res.status(200).json(result.data);
  } catch (error) {
    console.error('Error fetching weather:', error);
    res.status(400).json('Invalid request');
  }
};
