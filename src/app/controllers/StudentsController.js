import * as Yup from 'yup';

import Student from '../models/Students';

class StudentController {
  async store(req, res) {
    const schema = {
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      weight: Yup.string().required(),
      height: Yup.string().required(),
    };

    if (!(await schema.isValid(req.body))) {
      return res.json(400).json({ error: 'Insira os dados corretamente.' });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res
        .status(400)
        .json({ error: 'Este email já foi cadastrado anteriormente.' });
    }

    const { id, name, email } = await Student.create(req.body);

    return res.status(200).json({
      id,
      name,
      email,
      message: 'Aluno cadastrado com sucesso.',
    });
  }
}

export default new StudentController();
