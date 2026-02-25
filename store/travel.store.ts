'use client';

import { create } from 'zustand';

import { Travel } from '@/schemas/travel.schema';

interface TravelState {
  travels: Travel[];
  setTravels: (travels: Travel[]) => void;
}

export const useTravelStore = create<TravelState>((set) => ({
  travels: [],
  setTravels: (travels) =>
    set((state) => ({
      travels: [...state.travels, ...travels],
    })),
}));
