// types/UserType.ts
export interface UserType {
	type: "user";
	id: number;
	title: string;
	username: string;
	isLive: boolean;
	viewers: number;
  }