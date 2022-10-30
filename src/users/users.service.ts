import { inject, injectable } from 'inversify';
import { UserModel } from '@prisma/client';
import { IConfigService } from '../config/config.service.inerface';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUsersRepository } from './users.repository.interface';
import { IUsersService } from './users.service.interface';

@injectable()
export class UsersService implements IUsersService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
	) {}
	async createUser(dto: UserRegisterDto): Promise<UserModel | null> {
		const existedUser = await this.usersRepository.find(dto.email);
		if (existedUser) {
			return null;
		}

		const salt = this.configService.get('SALT');
		const newUser = new User(dto.email, dto.name);
		await newUser.setPassword(dto.password, Number(salt));

		return this.usersRepository.create(newUser);
	}

	async validateUser(dto: UserLoginDto): Promise<boolean> {
		const existedUser = await this.usersRepository.find(dto.email);
		console.log('+++ existedUser', existedUser)
		if (!existedUser) {
			return false;
		}

		const newUser = new User(existedUser.email, existedUser.name, existedUser.password);

		return newUser.comparePassword(dto.password);
	}
}
