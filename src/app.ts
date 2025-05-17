import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { errorHandler } from './middleware/error-handler.middleware';
import weatherRoutes from '#routes/weatherRoutes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const swaggerDocument = YAML.load(path.join(__dirname, './swagger.yaml'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send('Weather API is running. Visit /api-docs for documentation');
});

app.use('/api', weatherRoutes);

app.use(errorHandler);

export default app;
