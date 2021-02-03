import AppError from '@errors/AppError';
import User from '@models/User';
import ICacheProvider from '@providers/cache/ICacheProvider';
import IHashProvider from '@providers/hash/IHashProvider';
import ICreateUserDTO from '@repositories/dtos/ICreateUserDTO';
import IUserRepository from '@repositories/IUserRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export default class CreateUserService {
  constructor(
    @inject('UserRepository') private userRepository: IUserRepository,
    @inject('HashProvider') private hash: IHashProvider,
    @inject('CacheProvider') private cacheProvider: ICacheProvider,
  ) { }
  public async execute({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const checkUserExists = await this.userRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('This e-mail is already being used');
    }

    // hash password
    const hashedPassword = await this.hash.generateHash(password);

    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.cacheProvider.invalidatePrefix('list-providers');

    return user;
  }
}
