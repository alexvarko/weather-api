# Weather Forecast API

A RESTful API service that allows users to subscribe to regular weather updates for their chosen city. Built with Express.js, TypeScript, PostgreSQL, and Docker.

## Features

- Get current weather data for any city
- Subscribe to receive weather updates via email
- Choose update frequency (hourly or daily)
- Email confirmation for subscriptions
- Unsubscribe functionality
- API documentation with Swagger
- Containerized with Docker
- Database migrations with Knex.js

## Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL
- **ORM**: Knex.js
- **Weather Data**: WeatherAPI.com
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker, Docker Compose
- **Email**: Nodemailer
- **Scheduling**: node-cron

## Project Structure

```
weather-api
├── src
|   ├── config               # Contains configuration of app
│   ├── controllers          # Contains controllers for handling API requests
│   ├── models               # Contains data models for the application
│   ├── routes               # Contains route definitions for the API
│   ├── app.ts               # Contains API routes and swagger docs configuration
│   ├── server.ts            # Entry point of the application
│   └── swagger.yaml         # Contains API documentation
├── docker-compose.yml       # Docker compose file to start application
├── Dockerfile               # Dockerfile for building application
├── package.json             # NPM configuration file
├── tsconfig.json            # TypeScript configuration file
└── README.md                # Project documentation
```

## API Endpoints

- `GET /api/weather?city={city}` - Get current weather for a city
- `POST /api/subscribe` - Subscribe to weather updates
- `GET /api/confirm/{token}` - Confirm email subscription
- `GET /api/unsubscribe/{token}` - Unsubscribe from weather updates

## Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- WeatherAPI.com API key
- SMTP server for sending emails

## Setup and Installation

### Using Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/weather-api.git
   cd weather-api
   ```

2. Create a `.env` file from the template:
   ```bash
   cp .env.example .env
   ```

3. Update the `.env` file with your actual values:
   - Add your WeatherAPI.com API key
   - Configure your SMTP server details
   - Set your preferred base URL

4. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

The application will be available at http://localhost:3000.

### Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/weather-api.git
   cd weather-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the template:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your actual values.

5. Create a PostgreSQL database and update the connection details in `.env`.

6. Run database migrations:
   ```bash
   npm run migrate
   ```

7. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at http://localhost:3000.

## API Documentation

Once the server is running, you can access the Swagger documentation at http://localhost:3000/api-docs.

## Implementation Logic

The application follows these main workflows:

### Weather Data Retrieval
- Fetches weather data from WeatherAPI.com
- Formats the response to match the API contract
- Handles error cases like invalid cities

### Subscription Flow
1. User submits subscription request with email, city, and frequency
2. System validates the city against WeatherAPI.com
3. System checks if the subscription already exists
4. System creates a new subscription record with confirmation and unsubscribe tokens
5. System sends a confirmation email with the confirmation token
6. User clicks the confirmation link to activate the subscription

### Weather Update Schedule
- Hourly scheduler runs every hour to send updates to hourly subscribers
- Daily scheduler runs at 8 AM to send updates to daily subscribers
- System fetches the current weather for each subscriber's city
- System sends customized email updates with unsubscribe links

### Unsubscribe Flow
1. User clicks the unsubscribe link in any weather update email
2. System verifies the unsubscribe token
3. System removes the subscription from the database
4. User receives confirmation of unsubscription

## License

This project is licensed under the MIT License - see the LICENSE file for details.