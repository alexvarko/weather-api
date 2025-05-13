import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error-handler.middleware';

const app = express();

app.use(cors());
app.use(express.json());

const swaggerDocument = YAML.load(path.join(__dirname, './swagger.yaml'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorHandler);

export default app;