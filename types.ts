export interface Address {
  street: string;
  number: string;
  neighborhood: string;
}

export interface BookingFormState {
  name: string;
  whatsapp: string;
  time: string;
  needsTrunk: boolean;
  pickup: Address;
  destination: Address;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isClubMember: boolean;
  tripCount: number;
}

export enum ViewState {
  HOME = 'HOME',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  ADMIN = 'ADMIN',
}

export type TripStatus = 'pending' | 'confirmed' | 'cancelled';

export interface TripRecord {
  id: string;
  userId?: string; // Links trip to a specific user
  date: string;
  clientName: string;
  pickup: string;
  destination: string;
  status: TripStatus;
}

export interface Car {
  type: string;
  description: string;
  image: string;
}