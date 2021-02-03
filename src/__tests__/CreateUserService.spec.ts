import AppError from '@errors/AppError';
import FakeCacheProvider from '@providers/cache/impl/FakeCacheProvider';
import FakeHashProvider from '@providers/hash/impl/FakeHashProvider';
import ICreateUserDTO from '@repositories/dtos/ICreateUserDTO';
import FakeUsersRepository from '@repositories/fakes/FakeUsersRepository';
import CreateUserService from '@services/CreateUserService';

let fakeRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let service: CreateUserService;

describe('Create User', () => {
  beforeEach(() => {
    fakeCacheProvider = new FakeCacheProvider();
    fakeRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    service = new CreateUserService(
      fakeRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });
  it('Deve criar um novo usuário', async () => {
    const createdUser = await service.execute({
      name: 'Leonardo Henrique de Braz',
      email: 'lhleonardo@hotmail.com',
      password: '123456',
    });

    expect(createdUser).toHaveProperty('id');
  });

  it('Não deve permitir e-mail duplicado', async () => {
    const user: ICreateUserDTO = {
      name: 'Leonardo Henrique de Braz',
      email: 'lhleonardo@hotmail.com',
      password: '123456',
    };

    await service.execute(user);

    expect(service.execute(user)).rejects.toBeInstanceOf(AppError);
  });
});
