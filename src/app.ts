import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { errorHandler } from './middleware/error-handler.middleware';
import weatherRoutes from '#routes/weatherRoutes';
import subscriptionRoutes from '#routes/subscriptionRoutes';
import { scheduleTasks } from '#services/scheduler';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const swaggerDocument = YAML.load(path.join(__dirname, './swagger.yaml'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send('Weather API is running. Visit /api-docs for documentation');
});

app.use('/api', weatherRoutes);
app.use('/api', subscriptionRoutes);

app.use(errorHandler);

scheduleTasks();

export default app;
