import app from './app';
import 'tsconfig-paths/register';
import config from '#config/config';
import { runMigrations } from '#database/database';

const PORT = config.port || 3000;

const startServer = async () => {
  try {
    await runMigrations();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(
        `Swagger documentation is available at http://localhost:${PORT}/api-docs`,
      );
    });
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  }
};

startServer();
