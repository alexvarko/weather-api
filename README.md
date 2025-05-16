# Weather API

This project is a TypeScript-based weather API application that allows users to subscribe to weather updates for a choosen city. 

## Setup and Installation

### Using Docker

1. Clone the repository:
   ```bash
   git clone https://github.com/alexvarko/weather-api.git
   cd weather-api
   ```

2. Update environment variables in `docker-compose.yaml` with your actual values

3. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

The application will be available at http://localhost:3000.

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/alexvarko/weather-api.git
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

6. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at http://localhost:3000.

## Usage

- Swagger documentation is available at http://localhost:3000/api-docs
- API is available on http://localhost:3000/api
