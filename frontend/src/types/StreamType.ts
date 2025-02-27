export interface StreamType {
	type: "stream";
	id: number;
	title: string;
	username: string;
	streamCategory: string;
	viewers: number;
	thumbnail?: string;
  }