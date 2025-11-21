/**
 * Base repository with common methods for working with data
 */

import { SupabaseClient } from "@supabase/supabase-js"
import { Database } from "@/types/database.types"

type TableName = keyof Database["public"]["Tables"]
type TableRow<T extends TableName> = Database["public"]["Tables"][T]["Row"]
type TableInsert<T extends TableName> = Database["public"]["Tables"][T]["Insert"]
type TableUpdate<T extends TableName> = Database["public"]["Tables"][T]["Update"]

export type SupabaseClientType = SupabaseClient<Database>

export interface BaseRepository<T extends TableName> {
  findAll(filters?: Record<string, unknown>, orderBy?: { column: string; ascending?: boolean }, organizationId?: string): Promise<TableRow<T>[]>
  findById(id: string, organizationId?: string): Promise<TableRow<T> | null>
  create(data: TableInsert<T>, organizationId?: string): Promise<TableRow<T>>
  update(id: string, data: TableUpdate<T>, organizationId?: string): Promise<TableRow<T>>
  delete(id: string, organizationId?: string): Promise<void>
  count(filters?: Record<string, unknown>, organizationId?: string): Promise<number>
}

/**
 * Abstract base repository class
 */
export abstract class BaseRepositoryImpl<T extends TableName> implements BaseRepository<T> {
  protected client: SupabaseClientType
  protected tableName: T

  constructor(client: SupabaseClientType, tableName: T) {
    this.client = client
    this.tableName = tableName
  }

  async findAll(
    filters?: Record<string, unknown>,
    orderBy?: { column: string; ascending?: boolean },
    organizationId?: string
  ): Promise<TableRow<T>[]> {
    let query = this.client.from(this.tableName).select("*")

    // Add organization_id filter if provided
    if (organizationId) {
      query = query.eq("organization_id" as any, organizationId)
    }

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            query = query.in(key as any, value)
          } else {
            query = query.eq(key as any, value)
          }
        }
      })
    }

    if (orderBy) {
      query = query.order(orderBy.column as any, { ascending: orderBy.ascending ?? true })
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch ${this.tableName}: ${error.message}`)
    }

    return (data || []) as unknown as TableRow<T>[]
  }

  async findById(id: string, organizationId?: string): Promise<TableRow<T> | null> {
    let query = this.client
      .from(this.tableName)
      .select("*")
      .eq("id" as any, id)
    
    if (organizationId) {
      query = query.eq("organization_id" as any, organizationId)
    }
    
    const { data, error } = await query.single()

    if (error) {
      if (error.code === "PGRST116") {
        // Not found
        return null
      }
      throw new Error(`Failed to fetch ${this.tableName} by id: ${error.message}`)
    }

    return data as unknown as TableRow<T>
  }

  async create(data: TableInsert<T>, organizationId?: string): Promise<TableRow<T>> {
    const insertData = organizationId 
      ? { ...data, organization_id: organizationId } as TableInsert<T>
      : data
    
    const query = this.client
      .from(this.tableName)
    const { data: created, error } = await query.insert(insertData as any).select().single()

    if (error) {
      throw new Error(`Failed to create ${this.tableName}: ${error.message}`)
    }

    return created as unknown as TableRow<T>
  }

  async update(id: string, data: TableUpdate<T>, organizationId?: string): Promise<TableRow<T>> {
    let query = this.client
      .from(this.tableName)
      .update(data as any)
      .eq("id" as any, id)
    
    if (organizationId) {
      query = query.eq("organization_id" as any, organizationId)
    }
    
    const { data: updated, error } = await query.select().single()

    if (error) {
      throw new Error(`Failed to update ${this.tableName}: ${error.message}`)
    }

    return updated as unknown as TableRow<T>
  }

  async delete(id: string, organizationId?: string): Promise<void> {
    let query = this.client
      .from(this.tableName)
      .delete()
      .eq("id" as any, id)
    
    if (organizationId) {
      query = query.eq("organization_id" as any, organizationId)
    }
    
    const { error } = await query

    if (error) {
      throw new Error(`Failed to delete ${this.tableName}: ${error.message}`)
    }
  }

  async count(filters?: Record<string, unknown>, organizationId?: string): Promise<number> {
    let query = this.client.from(this.tableName).select("*", { count: "exact", head: true })

    // Add organization_id filter if provided
    if (organizationId) {
      query = query.eq("organization_id" as any, organizationId)
    }

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            query = query.in(key as any, value)
          } else {
            query = query.eq(key as any, value)
          }
        }
      })
    }

    const { count, error } = await query

    if (error) {
      throw new Error(`Failed to count ${this.tableName}: ${error.message}`)
    }

    return count || 0
  }
}

