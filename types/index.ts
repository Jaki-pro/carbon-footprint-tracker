export type EmissionFactor = {
  id: number;
  name: string;
  category: Category;
  unit: string;
};

export type Category = 'Transport' | 'Food' | 'Energy' | 'Waste';
