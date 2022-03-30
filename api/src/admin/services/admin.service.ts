import { Injectable } from '@nestjs/common';

export type Admin = any;

@Injectable()
export class AdminService {

  private readonly users = [
    {
			_id: 1,
      name: 'admin',
      firstName: 'admin',
			lastName: '',
      email: 'admin@stealth-app.com',
      password: 'admin@123',
      isAdmin: true
    },
    {
			_id: 2,
      name: 'naved',
      firstName: 'naved',
			lastName: '',
      email: 'naved@stealth-app.com',
      password: 'naved@123',
      isAdmin: true
    },
  ];

  async findOne(email: string): Promise<Admin | undefined> {
    return this.users.find(user => user.email === email);
  }
}
