import { createContext, useContext, useState, useEffect } from "react";

interface StreamItem {
  id: number;
  title: string;
  streamer: string;
  viewers: number;
  thumbnail?: string;
}

interface StreamsContextType {
  featuredStreams: StreamItem[];
  setFeaturedStreams: (streams: StreamItem[]) => void;
}

const StreamsContext = createContext<StreamsContextType | undefined>(undefined);

export function StreamsProvider({ children }: { children: React.ReactNode }) {
  const [featuredStreams, setFeaturedStreams] = useState<StreamItem[]>([]);

  useEffect(() => {
    fetch("/api/get_streams")
      .then((response) => response.json())
      .then((data: StreamItem[]) => {
        setFeaturedStreams(data);
      });
  }, []);

  return (
    <StreamsContext.Provider value={{ featuredStreams, setFeaturedStreams }}>
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
