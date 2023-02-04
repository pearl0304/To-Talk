import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    try {
      const user = await this.usersService.findOneByEmail(email);
      if (user) {
        if (await bcrypt.compare(pass, user.password)) {
          delete user.password;
          user.uid = user._id;
          return user;
        }
      }
      return null;
    } catch (e) {
      throw e;
    }
  }

  async generateUserCredentials(user: User) {
    try {
      const payload = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL ? user.photoURL : '',
        intro: user.intro ? user.intro : '',
        date_created: user.date_created,
        date_updated: user.date_updated,
        level: user.level,
      };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (e) {
      throw e;
    }
  }
}
