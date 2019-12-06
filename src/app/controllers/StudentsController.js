import * as Yup from 'yup';

import Student from '../models/Students';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      weight: Yup.string().required(),
      height: Yup.string().required(),
    });

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

  async update(req, res) {
    // VALIDAÇÃO DOS DADOS
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string()
        .email()
        .required(),
      weight: Yup.string(),
      height: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json(400).json({ error: 'Preencha corretamente o campo.' });
    }

    const { email } = req.body;

    const user = await Student.findOne({ where: { email } });

    if (!user) {
      return res
        .status(401)
        .json({ error: 'Aluno não encontrado. Verifique o email preenchido.' });
    }

    if (email !== user.email) {
      const emailExists = await Student.findOne({ where: { email } });

      if (emailExists) {
        return res
          .status(400)
          .json({ error: 'Há outro aluno cadastrado com este email.' });
      }
    }

    const { id } = user;
    const { name } = await Student.update(
      { weight: req.body.weight, height: req.body.height, name: req.body.name },
      { where: { email } }
    );

    return res.status(200).json({
      id,
      name,
      message: 'Aluno atualizado com sucesso.',
    });
  }
}

export default new StudentController();
