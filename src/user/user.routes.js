import { Router } from "express";
import { signup, signin, logout, userProfile } from './user.controler.js'
import { isAuthenticated } from '../middlewares/auth.js';


const router = Router();

router.post(
    '/signup',
    signup
);

router.post(
    '/signin',
    signin
);

router.get(
    '/logout',
    logout
);

router.get('/me',
    isAuthenticated,
    userProfile
);

export default router;