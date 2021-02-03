import config from '@config/auth';
import AppError from '@errors/AppError';
import User from '@models/User';
import IHashProvider from '@providers/hash/IHashProvider';
import IUserRepository from '@repositories/IUserRepository';
import { classToClass } from 'class-transformer';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
export default class AuthenticateUserService {
  constructor(
    @inject('UserRepository') private userRepository: IUserRepository,
    @inject('HashProvider') private hash: IHashProvider,
  ) { }

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const validUser = await this.userRepository.findByEmail(email);

    if (!validUser) {
      throw new AppError('Bad credentials.', 401);
    }

    const validPassword = await this.hash.compare(password, validUser.password);

    if (!validPassword) {
      throw new AppError('Bad credentials.', 401);
    }
    const token = sign({}, config.jwt.secret, {
      subject: validUser.id,
      expiresIn: config.jwt.expiresIn,
    });
    return {
      user: classToClass(validUser),
      token,
    };
  }
}
