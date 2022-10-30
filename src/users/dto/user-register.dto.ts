import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'Invalid email' })
	email: string;
	@IsString({ message: 'Name is empty' })
	name: string;
	@IsString({ message: 'Password is empty' })
	password: string;
}
