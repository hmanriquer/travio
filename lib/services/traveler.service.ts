import { travelers } from "@/drizzle/schema"
import { TravelerRepository } from "@/lib/repositories/traveler.repository"

type Traveler = typeof travelers.$inferSelect
type NewTraveler = typeof travelers.$inferInsert

/**
 * Encapsulates all business logic related to travelers.
 * Depends on TravelerRepository for data access; never touches the DB directly.
 */
export class TravelerService {
  private readonly travelerRepository: TravelerRepository

  constructor(
    travelerRepository: TravelerRepository = new TravelerRepository()
  ) {
    this.travelerRepository = travelerRepository
  }

  /**
   * Returns all travelers, ordered by name.
   */
  async getAll(): Promise<Traveler[]> {
    return this.travelerRepository.findAll()
  }

  /**
   * Returns a traveler by ID.
   * Throws if the traveler does not exist.
   */
  async getById(id: string): Promise<Traveler> {
    const traveler = await this.travelerRepository.findById(id)
    if (!traveler) {
      throw new Error(`Traveler with id "${id}" not found.`)
    }
    return traveler
  }

  /**
   * Creates a new traveler after normalizing the name.
   */
  async create(
    data: Omit<NewTraveler, "id" | "createdAt" | "updatedAt">
  ): Promise<Traveler> {
    return this.travelerRepository.create({
      ...data,
      name: data.name.trim(),
    })
  }

  /**
   * Updates an existing traveler.
   * Throws if the traveler does not exist.
   */
  async update(
    id: string,
    data: Partial<Omit<NewTraveler, "id" | "createdAt">>
  ): Promise<Traveler> {
    const updated = await this.travelerRepository.update(id, data)
    if (!updated) {
      throw new Error(`Traveler with id "${id}" not found.`)
    }
    return updated
  }

  /**
   * Deletes a traveler by ID.
   * Throws if the traveler does not exist.
   */
  async delete(id: string): Promise<void> {
    const deleted = await this.travelerRepository.delete(id)
    if (!deleted) {
      throw new Error(`Traveler with id "${id}" not found.`)
    }
  }
}
