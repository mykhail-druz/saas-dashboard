/**
 * Repository for working with users
 */

import { BaseRepositoryImpl, SupabaseClientType } from "./base.repository"
import { Database } from "@/types/database.types"

type User = Database["public"]["Tables"]["users"]["Row"]

export class UsersRepository extends BaseRepositoryImpl<"users"> {
  constructor(client: SupabaseClientType) {
    super(client, "users")
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.client
      .from("users")
      .select("*")
      .eq("email", email)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return null
      }
      throw new Error(`Failed to find user by email: ${error.message}`)
    }

    return data as User
  }

  async findByStatus(status: string): Promise<User[]> {
    return this.findAll({ status })
  }

  async findByRole(role: string): Promise<User[]> {
    return this.findAll({ role })
  }
}

