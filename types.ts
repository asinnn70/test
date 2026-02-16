export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  description: string;
  lastUpdated: string;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  INVENTORY = 'INVENTORY',
  AI_CHAT = 'AI_CHAT'
}

export interface ChartData {
  name: string;
  value: number;
}

export interface AISuggestion {
  description: string;
  category: string;
  estimatedPrice: number;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF'
}

export interface User {
  username: string;
  name: string;
  role: UserRole;
}