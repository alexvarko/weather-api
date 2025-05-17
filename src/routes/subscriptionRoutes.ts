import express from 'express';
import {
  subscribe,
  confirmSubscription,
  unsubscribe,
} from '#controllers/subscriptionController';
import multer from 'multer';

const upload = multer();

const router = express.Router();

router.post('/subscribe', upload.none(), subscribe);

router.get('/confirm/:token', confirmSubscription);

router.get('/unsubscribe/:token', unsubscribe);

export default router;
