import express from 'express';
const router = express.Router();
import {signup, signin, signout, sendVerificationCode} from '../controllers/authController.js'

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', signout);

router.patch('/send-verification-code', sendVerificationCode);

export default router;