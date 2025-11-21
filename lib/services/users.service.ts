/**
 * Service for working with users (business logic)
 */

import { UsersRepository } from "@/lib/repositories/users.repository"
import { SupabaseClientType } from "@/lib/repositories/base.repository"
import { Database } from "@/types/database.types"

type User = Database["public"]["Tables"]["users"]["Row"]
type UserInsert = Database["public"]["Tables"]["users"]["Insert"]
type UserUpdate = Database["public"]["Tables"]["users"]["Update"]

export class UsersService {
  private repository: UsersRepository

  constructor(client: SupabaseClientType) {
    this.repository = new UsersRepository(client)
  }

  async getAllUsers(): Promise<User[]> {
    return this.repository.findAll(undefined, { column: "created_at", ascending: false })
  }

  async getUserById(id: string): Promise<User | null> {
    return this.repository.findById(id)
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.repository.findByEmail(email)
  }

  async createUser(data: UserInsert): Promise<User> {
    return this.repository.create(data)
  }

  async updateUser(id: string, data: UserUpdate): Promise<User> {
    return this.repository.update(id, {
      ...data,
      updated_at: new Date().toISOString(),
    })
  }

  async deleteUser(id: string): Promise<void> {
    return this.repository.delete(id)
  }

  async getUsersByStatus(status: string): Promise<User[]> {
    return this.repository.findByStatus(status)
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return this.repository.findByRole(role)
  }

  async getUserCount(): Promise<number> {
    return this.repository.count()
  }
}

