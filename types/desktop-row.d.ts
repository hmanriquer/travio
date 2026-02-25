import type { TravelWithTraveler } from '@/schemas/travel.schema';

export interface DesktopRow {
  expense: TravelWithTraveler;
  expanded: boolean;
  onToggle: () => void;
}
