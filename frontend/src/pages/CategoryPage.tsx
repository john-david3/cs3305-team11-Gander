import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ListRow from "../components/Layout/ListRow";
import { useNavigate } from "react-router-dom";
import DynamicPageContent from "../components/Layout/DynamicPageContent";
import { fetchContentOnScroll } from "../hooks/fetchContentOnScroll";
import Button from "../components/Input/Button";
import { useAuth } from "../context/AuthContext";
import { useCategoryFollow } from "../hooks/useCategoryFollow";

interface StreamData {
  type: "stream";
  id: number;
  title: string;
  streamer: string;
  streamCategory: string;
  viewers: number;
  thumbnail?: string;
}

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [streams, setStreams] = useState<StreamData[]>([]);
  const listRowRef = useRef<any>(null);
  const isLoading = useRef(false);
  const navigate = useNavigate();
  const [streamOffset, setStreamOffset] = useState(0);
  const [noStreams, setNoStreams] = useState(12);
  const [hasMoreData, setHasMoreData] = useState(true);
  const { isLoggedIn } = useAuth();
  const { isCategoryFollowing, checkCategoryFollowStatus, followCategory, unfollowCategory } = useCategoryFollow()

  useEffect(() => {
    checkCategoryFollowStatus(categoryName);
  }, [categoryName]);

  const fetchCategoryStreams = async () => {
    // If already loading, skip this fetch
    if (isLoading.current) return;

    isLoading.current = true;
    try {
      const response = await fetch(`/api/streams/popular/${categoryName}/${noStreams}/${streamOffset}`);
      if (!response.ok) {
        throw new Error("Failed to fetch category streams");
      }
      const data = await response.json();

      if (data.length === 0) {
        setHasMoreData(false);
        return [];
      }

      setStreamOffset(prev => prev + data.length);

      const processedStreams = data.map((stream: any) => ({
        type: "stream",
        id: stream.user_id,
        title: stream.title,
        streamer: stream.username,
        streamCategory: categoryName,
        viewers: stream.num_viewers,
        thumbnail:
          stream.thumbnail ||
          (categoryName &&
            `/images/category_thumbnails/${categoryName
              .toLowerCase()
              .replace(/ /g, "_")}.webp`),
      }));

      setStreams(prev => [...prev, ...processedStreams]);
      return processedStreams
    } catch (error) {
      console.error("Error fetching category streams:", error);
    } finally {
      isLoading.current = false;
    }
  };

  useEffect(() => {
    fetchCategoryStreams();
  }, []);

  const logOnScroll = async () => {
    if (hasMoreData && listRowRef.current) {
      const newCategories = await fetchCategoryStreams();
      if (newCategories?.length > 0) {
        listRowRef.current.addMoreItems(newCategories);
      }
    }
  };

  fetchContentOnScroll(logOnScroll, hasMoreData);


  const handleStreamClick = (streamerName: string) => {
    navigate(`/${streamerName}`);
  };

  if (hasMoreData && !streams.length) {
    return (
      <div className="h-screen w-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <DynamicPageContent
      className="min-h-screen bg-gradient-radial from-[#ff00f1] via-[#0400ff] to-[#ff0000]"
      style={{ backgroundImage: "url(/images/background-pattern.svg)" }}
    >
      <div className="pt-8">
        <ListRow
          type="stream"
          title={`${categoryName} Streams`}
          description={`Live streams in the ${categoryName} category`}
          items={streams}
          wrap={true}
          onClick={handleStreamClick}
          extraClasses="bg-[var(--recommend)]"
        >
          {isLoggedIn && (
            <Button
              extraClasses="absolute right-10"
              onClick={() => {
                isCategoryFollowing ? unfollowCategory(categoryName) : followCategory(categoryName)
              }}
            >
              {isCategoryFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}
        </ListRow>
      </div>

      {streams.length === 0 && !isLoading && (
        <div className="text-white text-center text-2xl mt-8">
          No live streams found in this category
        </div>
      )}
    </DynamicPageContent>
  );
};

export default CategoryPage;
