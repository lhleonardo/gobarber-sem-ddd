import AppError from '@errors/AppError';
import IMailProvider from '@providers/mail/IMailProvider';
import IUserRepository from '@repositories/IUserRepository';
import IUserTokenRepository from '@repositories/IUserTokenRepository';
import path from 'path';
import { inject, injectable } from 'tsyringe';


interface IRequest {
  email: string;
}

@injectable()
export default class SendForgotPasswordEmailService {
  constructor(
    @inject('MailProvider')
    private mailService: IMailProvider,
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('UserTokenRepository')
    private userTokenRepository: IUserTokenRepository,
  ) { }
  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError(`O e-mail ${email} não está cadastrado na aplicação`);
    }

    const { token } = await this.userTokenRepository.generate(user.id);

    await this.mailService.sendMail({
      subject: 'Redefinição de senha',
      to: { name: user.name, email: user.email },
      template: {
        file: path.resolve(
          __dirname,
          '..',
          'views',
          'forgot_password_template.hbs',
        ),
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset-password?token=${token}`,
          email: user.email,
        },
      },
    });
  }
}
