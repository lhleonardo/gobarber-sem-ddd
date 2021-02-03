import AppError from '@errors/AppError';
import User from '@models/User';
import IUserRepository from '@repositories/IUserRepository';
import { classToClass } from 'class-transformer';
import { inject, injectable } from 'tsyringe';

@injectable()
class ShowUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) { }

  public async execute(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError('Usuário inexistente');
    }

    return classToClass(user);
  }
}

export default ShowUserService;
