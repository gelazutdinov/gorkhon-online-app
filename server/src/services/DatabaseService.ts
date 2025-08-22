import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  middleName?: string;
  phone?: string;
  birthDate?: string;
  avatar?: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'banned';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  loginCount: number;
}

export class DatabaseService {
  private static instance: DatabaseService;
  private db: sqlite3.Database | null = null;

  private constructor() {}

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const dbPath = path.join(process.cwd(), 'database.sqlite');
      
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('Ошибка подключения к базе данных:', err);
          reject(err);
          return;
        }
        console.log('✅ База данных SQLite подключена');
        this.createTables().then(resolve).catch(reject);
      });
    });
  }

  private createTables(): Promise<void> {
    return new Promise((resolve, reject) => {
      const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          name TEXT NOT NULL,
          middleName TEXT,
          phone TEXT,
          birthDate TEXT,
          avatar TEXT,
          role TEXT DEFAULT 'user',
          status TEXT DEFAULT 'active',
          isVerified INTEGER DEFAULT 0,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          lastLoginAt TEXT,
          loginCount INTEGER DEFAULT 0
        )
      `;

      this.db!.run(createUsersTable, (err) => {
        if (err) {
          console.error('Ошибка создания таблицы users:', err);
          reject(err);
          return;
        }
        
        // Создаем админа по умолчанию
        this.createDefaultAdmin().then(() => {
          console.log('✅ Таблицы базы данных созданы');
          resolve();
        }).catch(reject);
      });
    });
  }

  private async createDefaultAdmin(): Promise<void> {
    const adminEmail = 'smm@gelazutdinov.ru';
    
    return new Promise((resolve, reject) => {
      // Проверяем, существует ли админ
      this.db!.get('SELECT id FROM users WHERE email = ?', [adminEmail], async (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        if (!row) {
          // Создаем админа
          const hashedPassword = await bcrypt.hash('admin123', 10);
          const adminId = `admin_${Date.now()}`;
          const now = new Date().toISOString();

          const insertAdmin = `
            INSERT INTO users (
              id, email, password, name, role, status, 
              isVerified, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          this.db!.run(insertAdmin, [
            adminId,
            adminEmail,
            hashedPassword,
            'Администратор',
            'admin',
            'active',
            1,
            now,
            now
          ], (err) => {
            if (err) {
              console.error('Ошибка создания администратора:', err);
              reject(err);
            } else {
              console.log('✅ Администратор создан:', adminEmail);
              resolve();
            }
          });
        } else {
          resolve();
        }
      });
    });
  }

  // Методы для работы с пользователями
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'loginCount'>): Promise<User> {
    return new Promise((resolve, reject) => {
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date().toISOString();
      
      const insertUser = `
        INSERT INTO users (
          id, email, password, name, middleName, phone, birthDate, 
          avatar, role, status, isVerified, createdAt, updatedAt, loginCount
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      this.db!.run(insertUser, [
        userId,
        userData.email,
        userData.password,
        userData.name,
        userData.middleName || null,
        userData.phone || null,
        userData.birthDate || null,
        userData.avatar || null,
        userData.role || 'user',
        userData.status || 'active',
        userData.isVerified ? 1 : 0,
        now,
        now,
        0
      ], function(err) {
        if (err) {
          reject(err);
          return;
        }

        // Возвращаем созданного пользователя
        const newUser: User = {
          id: userId,
          ...userData,
          createdAt: now,
          updatedAt: now,
          loginCount: 0
        };
        resolve(newUser);
      });
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      this.db!.get('SELECT * FROM users WHERE email = ?', [email], (err, row: any) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (!row) {
          resolve(null);
          return;
        }

        resolve({
          ...row,
          isVerified: Boolean(row.isVerified)
        });
      });
    });
  }

  async getUserById(id: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      this.db!.get('SELECT * FROM users WHERE id = ?', [id], (err, row: any) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (!row) {
          resolve(null);
          return;
        }

        resolve({
          ...row,
          isVerified: Boolean(row.isVerified)
        });
      });
    });
  }

  async getAllUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      this.db!.all('SELECT * FROM users ORDER BY createdAt DESC', [], (err, rows: any[]) => {
        if (err) {
          reject(err);
          return;
        }

        const users = rows.map(row => ({
          ...row,
          isVerified: Boolean(row.isVerified)
        }));
        resolve(users);
      });
    });
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      const fields = Object.keys(updates).filter(key => key !== 'id');
      const setClause = fields.map(field => `${field} = ?`).join(', ');
      const values = fields.map(field => {
        if (field === 'isVerified') {
          return updates[field as keyof User] ? 1 : 0;
        }
        return updates[field as keyof User];
      });

      if (fields.length === 0) {
        reject(new Error('Нет полей для обновления'));
        return;
      }

      const updateQuery = `UPDATE users SET ${setClause}, updatedAt = ? WHERE id = ?`;
      values.push(now, id);

      this.db!.run(updateQuery, values, (err) => {
        if (err) {
          reject(err);
          return;
        }

        // Получаем обновленного пользователя
        this.getUserById(id).then(resolve).catch(reject);
      });
    });
  }

  async deleteUser(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db!.run('DELETE FROM users WHERE id = ?', [id], function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.changes > 0);
      });
    });
  }

  async updateLastLogin(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      
      this.db!.run(
        'UPDATE users SET lastLoginAt = ?, loginCount = loginCount + 1 WHERE id = ?',
        [now, id],
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        }
      );
    });
  }

  async getDatabaseStats(): Promise<any> {
    return new Promise((resolve, reject) => {
      const queries = [
        'SELECT COUNT(*) as totalUsers FROM users',
        'SELECT COUNT(*) as activeUsers FROM users WHERE status = "active"',
        'SELECT COUNT(*) as verifiedUsers FROM users WHERE isVerified = 1',
        'SELECT COUNT(*) as bannedUsers FROM users WHERE status = "banned"'
      ];

      let completed = 0;
      const results: any = {};

      queries.forEach((query, index) => {
        this.db!.get(query, [], (err, row: any) => {
          if (err) {
            reject(err);
            return;
          }

          const key = Object.keys(row)[0];
          results[key] = row[key];
          
          completed++;
          if (completed === queries.length) {
            resolve(results);
          }
        });
      });
    });
  }

  close(): void {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error('Ошибка закрытия базы данных:', err);
        } else {
          console.log('✅ База данных закрыта');
        }
      });
    }
  }
}