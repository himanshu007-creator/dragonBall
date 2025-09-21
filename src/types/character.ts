export interface Character {
  id: string;
  name: string;
  location: string;
  health: 'Healthy' | 'Injured' | 'Critical';
  power: number;
}
