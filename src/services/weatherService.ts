import config from '#config/config';
import { Weather } from '#models/weatherModel';
import axios from 'axios';

export class WeatherService {
  public async getWeatherByCity(city: string): Promise<{
    success: boolean;
    data?: Weather;
    error?: string;
    statusCode: number;
  }> {
    try {
      const response = await axios.get(
        `${config.weatherApi.baseUrl}current.json`,
        {
          params: {
            key: config.weatherApi.apiKey,
            q: city,
          },
          validateStatus: () => true,
        },
      );

      const weatherData = response.data;

      if (response.status === 400 && weatherData.error?.code === 1006) {
        return {
          success: false,
          error: 'City not found',
          statusCode: 404,
        };
      }

      if (response.status !== 200) {
        return {
          success: false,
          error: 'Invalid request',
          statusCode: 400,
        };
      }

      const weather: Weather = {
        temperature: weatherData.current.temp_c,
        humidity: weatherData.current.humidity,
        description: weatherData.current.condition.text,
      };

      return {
        success: true,
        data: weather,
        statusCode: 200,
      };
    } catch (error) {
      console.error('Error fetching weather:', error);
      return {
        success: false,
        error: 'Invalid request',
        statusCode: 400,
      };
    }
  }
}

export const weatherService = new WeatherService();
