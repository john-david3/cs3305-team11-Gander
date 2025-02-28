export interface VodType {
    type: "vod";
    id: number;
    title: string;
    streamer: string;
    datetime: string;
    category: string;
    length: number;
    views: number;
    url: string;
    thumbnail: string;
  }