import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import auth from '../../config/auth';

import User from '../models/User';

class SessionController {
  async store(req, res) {
    // Validação de campos inseridos pelo usuário
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Insira os campos corretamente.' });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({
        where: { email: 'admin@gympoint.com' },
      });

      if (!user) {
        return res.status(400).json({ error: 'Usuário não existe.' });
      }

      if (!(await user.checkPassword(password))) {
        return res.status(401).json({ error: 'A senha está incorreta.' });
      }

      const { id, name } = user;

      return res.status(200).json({
        user: {
          id,
          name,
          email,
        },
        token: jwt.sign({ id }, auth.secret, {
          expiresIn: auth.expiresIn,
        }),
      });
    } catch (error) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }
  }
}

export default new SessionController();
