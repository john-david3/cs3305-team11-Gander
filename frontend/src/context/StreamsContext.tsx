import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

interface StreamItem {
  id: number;
  title: string;
  streamer: string;
  viewers: number;
  thumbnail?: string;
}

interface StreamsContextType {
  featuredStreams: StreamItem[];
  featuredCategories: StreamItem[];
  setFeaturedStreams: (streams: StreamItem[]) => void;
  setFeaturedCategories: (categories: StreamItem[]) => void;
}

const StreamsContext = createContext<StreamsContextType | undefined>(undefined);

export function StreamsProvider({ children }: { children: React.ReactNode }) {
  const [featuredStreams, setFeaturedStreams] = useState<StreamItem[]>([]);
  const [featuredCategories, setFeaturedCategories] = useState<StreamItem[]>(
    []
  );
  const { isLoggedIn } = useAuth();

  const fetch_url = isLoggedIn
    ? ["/api/get_recommended_streams", "/api/get_followed_categories"]
    : ["/api/get_streams", "/api/get_categories"];

  useEffect(() => {
    fetch(fetch_url[0])
      .then((response) => response.json())
      .then((data: StreamItem[]) => {
        setFeaturedStreams(data);
      });
    fetch(fetch_url[1])
      .then((response) => response.json())
      .then((data: StreamItem[]) => {
        setFeaturedCategories(data);
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
