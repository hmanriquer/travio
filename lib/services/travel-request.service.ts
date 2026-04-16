import { TravelRequestRepository } from "@/lib/repositories/travel-request.repository"
import { TravelerRepository } from "@/lib/repositories/traveler.repository"
import { travelRequests } from "@/drizzle/schema"

type TravelRequest = typeof travelRequests.$inferSelect
type NewTravelRequest = typeof travelRequests.$inferInsert

/**
 * Encapsulates all business logic related to travel requests.
 * Depends on TravelRequestRepository and TravelerRepository for data access;
 * never touches the DB directly.
 */
export class TravelRequestService {
  private readonly travelRequestRepository: TravelRequestRepository
  private readonly travelerRepository: TravelerRepository

  constructor(
    travelRequestRepository: TravelRequestRepository = new TravelRequestRepository(),
    travelerRepository: TravelerRepository = new TravelerRepository(),
  ) {
    this.travelRequestRepository = travelRequestRepository
    this.travelerRepository = travelerRepository
  }

  /**
   * Returns all travel requests, most recently created first.
   */
  async getAll(): Promise<TravelRequest[]> {
    return this.travelRequestRepository.findAll()
  }

  /**
   * Returns a travel request by ID.
   * Throws if the request does not exist.
   */
  async getById(id: string): Promise<TravelRequest> {
    const request = await this.travelRequestRepository.findById(id)
    if (!request) {
      throw new Error(`Travel request with id "${id}" not found.`)
    }
    return request
  }

  /**
   * Returns all travel requests belonging to a specific traveler.
   * Validates that the traveler exists before querying.
   */
  async getByTravelerId(travelerId: string): Promise<TravelRequest[]> {
    const traveler = await this.travelerRepository.findById(travelerId)
    if (!traveler) {
      throw new Error(`Traveler with id "${travelerId}" not found.`)
    }
    return this.travelRequestRepository.findByTravelerId(travelerId)
  }

  /**
   * Creates a new travel request after validating the referenced traveler exists
   * and the date range is coherent.
   */
  async create(
    data: Omit<NewTravelRequest, "id" | "createdAt" | "updatedAt">,
  ): Promise<TravelRequest> {
    const traveler = await this.travelerRepository.findById(data.travelerId)
    if (!traveler) {
      throw new Error(`Traveler with id "${data.travelerId}" not found.`)
    }

    if (data.startDate && data.endDate && data.startDate > data.endDate) {
      throw new Error("Start date must be before or equal to end date.")
    }

    return this.travelRequestRepository.create(data)
  }

  /**
   * Updates an existing travel request.
   * Throws if the request does not exist.
   */
  async update(
    id: string,
    data: Partial<Omit<NewTravelRequest, "id" | "createdAt">>,
  ): Promise<TravelRequest> {
    if (data.startDate && data.endDate && data.startDate > data.endDate) {
      throw new Error("Start date must be before or equal to end date.")
    }

    const updated = await this.travelRequestRepository.update(id, data)
    if (!updated) {
      throw new Error(`Travel request with id "${id}" not found.`)
    }
    return updated
  }

  /**
   * Deletes a travel request by ID.
   * Throws if the request does not exist.
   */
  async delete(id: string): Promise<void> {
    const deleted = await this.travelRequestRepository.delete(id)
    if (!deleted) {
      throw new Error(`Travel request with id "${id}" not found.`)
    }
  }
}
