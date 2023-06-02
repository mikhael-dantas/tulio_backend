import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { compareSync, hashSync } from 'bcrypt';
import {
  CreateUserDto,
  CreateUserDtoSchema,
  UpdateUserDto,
  UpdateUserDtoSchema,
} from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  hashPassword(password: string): string {
    const saltRounds = 10;
    return hashSync(password, saltRounds);
  }

  comparePassword(password: string, hash: string): boolean {
    return compareSync(password, hash);
  }

  async authenticateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user || !this.comparePassword(password, user.password)) {
      console.log('Invalid credentials');
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.username };
    const token = this.jwtService.sign(payload, { secret: 'secret' });

    return { token };
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const validatedData = CreateUserDtoSchema.parse(createUserDto);
    const user = this.userRepository.create({
      ...validatedData,
      password: this.hashPassword(validatedData.password),
    });
    return this.userRepository.save(user);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const validatedData = UpdateUserDtoSchema.parse(updateUserDto);
    const user = await this.getUserById(id);
    this.userRepository.merge(user, {
      ...validatedData,
      password: validatedData.password
        ? this.hashPassword(validatedData.password)
        : undefined,
    });
    return this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.getUserById(id);
    await this.userRepository.remove(user);
  }
}
