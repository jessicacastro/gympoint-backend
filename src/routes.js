import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentsController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// ROTA TESTE
routes.get('/', (req, res) => {
  return res.json({ message: 'backend works' });
});

// ROTA DE LOGIN AUTH
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/students/register', StudentController.store);

export default routes;
