import FakeCacheProvider from '@providers/cache/impl/FakeCacheProvider';
import FakeUsersRepository from '@repositories/fakes/FakeUsersRepository';
import ListProviderServices from '@services/ListProvidersService';

let userRepository: FakeUsersRepository;
let listProviders: ListProviderServices;
let cacheProvider: FakeCacheProvider;

describe('ListProviders', () => {
  beforeEach(() => {
    userRepository = new FakeUsersRepository();
    cacheProvider = new FakeCacheProvider();
    listProviders = new ListProviderServices(userRepository, cacheProvider);
  });
  it('Deve listar todos os prestadores de serviço', async () => {
    const loggedUser = await userRepository.create({
      name: 'Leonardo Braz',
      email: 'lhleonardo@hotmail.com',
      password: '123123',
    });
    const provider1 = await userRepository.create({
      name: 'Matheus Castro',
      email: 'matheus@hotmail.com',
      password: '123123',
    });
    const provider2 = await userRepository.create({
      name: 'Maria Aparecida',
      email: 'maria@hotmail.com',
      password: '123123',
    });
    const providers = await listProviders.execute({
      excludeUserId: loggedUser.id,
    });

    expect(providers).toEqual(expect.arrayContaining([provider1, provider2]));
  });
});
