# Weather API

This project is a TypeScript-based weather API application that allows users to subscribe to weather updates for a choosen city. 

## Project structure

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

## Setup Instructions

1. **Install dependencies:**
   ```
   npm install
   ```

2. **Compile TypeScript files:**
   ```
   npm run build
   ```

3. **Run the application:**
   ```
   npm start
   ```

## Usage

- Swagger documentation is available at http://localhost:3000/api-docs
- API is available on http://localhost:3000/api
