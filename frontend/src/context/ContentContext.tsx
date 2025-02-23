import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

// Base interfaces
interface Item {
  id: number;
  title: string;
  viewers: number;
  thumbnail?: string;
}

interface StreamItem extends Item {
  type: "stream";
  streamer: string;
  streamCategory: string;
}

interface CategoryItem extends Item {
  type: "category";
}

interface UserItem extends Item {
  type: "user";
  username: string;
  isLive: boolean;
}

// Context type
interface ContentContextType {
  streams: StreamItem[];
  categories: CategoryItem[];
  users: UserItem[];
  setStreams: (streams: StreamItem[]) => void;
  setCategories: (categories: CategoryItem[]) => void;
  setUsers: (users: UserItem[]) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [streams, setStreams] = useState<StreamItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    // Fetch streams
    const streamsUrl = isLoggedIn
      ? "/api/streams/recommended"
      : "/api/streams/popular/4";

    fetch(streamsUrl)
      .then((response) => response.json())
      .then((data: any[]) => {
        const processedStreams: StreamItem[] = data.map((stream) => ({
          type: "stream",
          id: stream.user_id,
          title: stream.title,
          streamer: stream.username,
          streamCategory: stream.category_name,
          viewers: stream.num_viewers,
          thumbnail:
            stream.thumbnail ||
            `/images/category_thumbnails/${stream.category_name
              .toLowerCase()
              .replace(/ /g, "_")}.webp`,
        }));
        setStreams(processedStreams);
      });

    // Fetch categories
    const categoriesUrl = isLoggedIn
      ? "/api/categories/recommended"
      : "/api/categories/popular/4";

    fetch(categoriesUrl)
      .then((response) => response.json())
      .then((data: any[]) => {
        const processedCategories: CategoryItem[] = data.map((category) => ({
          type: "category",
          id: category.category_id,
          title: category.category_name,
          viewers: category.num_viewers,
          thumbnail: `/images/category_thumbnails/${category.category_name
            .toLowerCase()
            .replace(/ /g, "_")}.webp`,
        }));
        setCategories(processedCategories);
      });
  }, [isLoggedIn]);

  return (
    <ContentContext.Provider
      value={{
        streams,
        categories,
        users,
        setStreams,
        setCategories,
        setUsers,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

// Custom hooks for specific content types
export function useStreams() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useStreams must be used within a ContentProvider");
  }
  return { streams: context.streams, setStreams: context.setStreams };
}

export function useCategories() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useCategories must be used within a ContentProvider");
  }
  return {
    categories: context.categories,
    setCategories: context.setCategories,
  };
}

export function useUsers() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useUsers must be used within a ContentProvider");
  }
  return { users: context.users, setUsers: context.setUsers };
}

// General hook for all content
export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
}
