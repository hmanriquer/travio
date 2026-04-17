import type { TravelRequestStatus } from "./dashboard.types"

export type { TravelRequestStatus }

export type TravelRow = {
  id: string
  travelerName: string
  travelerDepartment: string | null
  destinationRegion: string
  travelReason: string
  startDate: string
  endDate: string
  days: number | null
  status: TravelRequestStatus
  depositAmount: string | null
  provenAmount: string | null
}

export type TravelsSummary = {
  totalRequests: number
  totalDeposited: number
  totalProven: number
  balance: number
}

export type StatusFilter = TravelRequestStatus | "ALL"

export type TravelsFilters = {
  search: string
  status: StatusFilter
}

export type TravelDetail = TravelRow & {
  traveler: {
    id: string
    name: string
    department: string | null
    jobTitle: string | null
    baseRegion: string | null
  }
  proofDeadline: string | null
  proofDate: string | null
  isProvenOnTime: boolean
  isProvenLate: boolean
  requestEmail: string | null
  createdAt: string
  updatedAt: string
}
