import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

interface Item {
  id: number;
  title: string;
  viewers: number;
  thumbnail?: string;
}

interface StreamItem extends Item {
  type: "stream";
  streamer: string;
}

interface CategoryItem extends Item {
  type: "category";
}

interface StreamsContextType {
  featuredStreams: StreamItem[];
  featuredCategories: CategoryItem[];
  setFeaturedStreams: (streams: StreamItem[]) => void;
  setFeaturedCategories: (categories: CategoryItem[]) => void;
}

const StreamsContext = createContext<StreamsContextType | undefined>(undefined);

export function StreamsProvider({ children }: { children: React.ReactNode }) {
  const [featuredStreams, setFeaturedStreams] = useState<StreamItem[]>([]);
  const [featuredCategories, setFeaturedCategories] = useState<CategoryItem[]>(
    []
  );
  const { isLoggedIn } = useAuth();

  const fetch_url = isLoggedIn
    ? ["/api/get_recommended_streams", "/api/get_followed_categories"]
    : ["/api/get_streams", "/api/get_categories"];

  useEffect(() => {
    // Streams
    fetch(fetch_url[0])
      .then((response) => response.json())
      .then((data) => {
        const extractedData: StreamItem[] = data.streams.map((stream: any) => ({
          type: "stream",
          id: stream.stream_id,
          title: stream.title,
          streamer: stream.user_id,
          viewers: stream.num_viewers,
          thumbnail: stream.thumbnail,
        }));
        setFeaturedStreams(extractedData);
      });

    // Categories
    fetch(fetch_url[1])
      .then((response) => response.json())
      .then((data) => {
        const extractedData: CategoryItem[] = data.categories.map(
          (category: any) => ({
            type: "category",
            id: category.category_id,
            title: category.category_name,
            viewers: category.num_viewers,
          })
        );
        setFeaturedCategories(extractedData);
      });
  }, []);

  return (
    <StreamsContext.Provider
      value={{
        featuredStreams,
        featuredCategories,
        setFeaturedStreams,
        setFeaturedCategories,
      }}
    >
      {children}
    </StreamsContext.Provider>
  );
}

export function useStreams() {
  const context = useContext(StreamsContext);
  if (context === undefined) {
    throw new Error("useStreams must be used within a StreamsProvider");
  }
  return context;
}
