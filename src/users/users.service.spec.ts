import 'reflect-metadata';
import { UserModel } from '@prisma/client';
import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.inerface';
import { TYPES } from '../types';
import { User } from './user.entity';
import { IUsersRepository } from './users.repository.interface';
import { UsersService } from './users.service';
import { IUsersService } from './users.service.interface';

const UsersRepositoryMock: IUsersRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const container = new Container();
let usersService: IUsersService;
let usersRepository: IUsersRepository;
let configService: IConfigService;

beforeAll(() => {
	container.bind<IUsersService>(TYPES.UsersService).to(UsersService);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);

	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
	usersService = container.get<IUsersService>(TYPES.UsersService);
	configService = container.get<IConfigService>(TYPES.ConfigService);
});

let createdUser: UserModel | null;

describe('UserService / model', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		usersRepository.create = jest.fn().mockImplementationOnce((user: User): UserModel => {
			return {
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			};
		});

		createdUser = await usersService.createUser({
			email: 'test@test.test',
			name: 'Test',
			password: '1',
		});

		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('1');
	});


	it('validateUser - success', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const res = await usersService.validateUser({
			email: 'a@a.ru',
			password: '1',
		});
		expect(res).toBeTruthy();
	});

	it('validateUser - wrong password', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const res = await usersService.validateUser({
			email: 'a@a.ru',
			password: '2',
		});
		expect(res).toBeFalsy();
	});

	it('validateUser - wrong user', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(null);
		const res = await usersService.validateUser({
			email: 'a2@a.ru',
			password: '2',
		});
		expect(res).toBeFalsy();
	});
});
