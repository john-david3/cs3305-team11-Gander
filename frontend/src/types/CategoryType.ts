// types/CategoryType.ts
export interface CategoryType {
	type: "category";
	id: number;
	title: string;
	viewers: number;
	thumbnail?: string;
  }