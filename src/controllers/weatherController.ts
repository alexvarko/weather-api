import { Request, Response } from 'express';
import axios from 'axios';
import { Weather } from '#models/weatherModel';
import weatherApi from '#config/config';

export const getWeather = async (req: Request, res: Response) => {
  const city = req.query.city;

  try {
    const response = await axios.get(
      `${weatherApi.weatherApi.baseUrl}current.json`,
      {
        params: {
          key: weatherApi.weatherApi.apiKey,
          q: city,
        },
        validateStatus: () => true,
      },
    );
    const weatherData = response.data;

    if (response.status == 400 && weatherData.error.code == 1006) {
      return res.status(404).json('City not found');
    }
    if (response.status != 200) {
      return res.status(400).json('Invalid request');
    }

    const weather: Weather = {
      temperature: weatherData.current.temp_c,
      humidity: weatherData.current.humidity,
      description: weatherData.current.condition.text,
    };

    res.status(200).json(weather);
  } catch (error) {
    console.error('Error fetching weather:', error);
    res.status(400).json('Invalid request');
  }
};
