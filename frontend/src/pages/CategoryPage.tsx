import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ListRow from "../components/Layout/ListRow";
import DynamicPageContent from "../components/Layout/DynamicPageContent";
import { fetchContentOnScroll } from "../hooks/fetchContentOnScroll";
import Button from "../components/Input/Button";
import { useAuth } from "../context/AuthContext";
import { useCategoryFollow } from "../hooks/useCategoryFollow";
import LoadingScreen from "../components/Layout/LoadingScreen";
import { StreamType } from "../types/StreamType";
import { getCategoryThumbnail } from "../utils/thumbnailUtils";

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [streams, setStreams] = useState<StreamType[]>([]);
  const listRowRef = useRef<any>(null);
  const isLoading = useRef(false);
  const [streamOffset, setStreamOffset] = useState(0);
  const [noStreams, setNoStreams] = useState(12);
  const [hasMoreData, setHasMoreData] = useState(true);
  const { isLoggedIn } = useAuth();
  const {
    isCategoryFollowing,
    checkCategoryFollowStatus,
    followCategory,
    unfollowCategory,
  } = useCategoryFollow();

  useEffect(() => {
    if (categoryName) checkCategoryFollowStatus(categoryName);
  }, [categoryName]);

  const fetchCategoryStreams = async () => {
    // If already loading, skip this fetch
    if (isLoading.current) return;

    isLoading.current = true;
    try {
      const response = await fetch(
        `/api/streams/popular/${categoryName}/${noStreams}/${streamOffset}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch category streams");
      }
      const data = await response.json();

      if (data.length === 0) {
        setHasMoreData(false);
        return [];
      }

      setStreamOffset((prev) => prev + data.length);

      const processedStreams = data.map((stream: any) => ({
        type: "stream",
        id: stream.user_id,
        title: stream.title,
        username: stream.username,
        streamCategory: categoryName,
        viewers: stream.num_viewers,
        thumbnail: getCategoryThumbnail(categoryName, stream.thumbnail),
      }));

      setStreams((prev) => [...prev, ...processedStreams]);
      return processedStreams;
    } catch (error) {
      console.error("Error fetching category streams:", error);
    } finally {
      isLoading.current = false;
    }
  };

  useEffect(() => {
    fetchCategoryStreams();
  }, []);

  const loadOnScroll = async () => {
    if (hasMoreData && listRowRef.current) {
      const newStreams = await fetchCategoryStreams();
      if (newStreams?.length > 0) {
        listRowRef.current.addMoreItems(newStreams);
      } else console.log("No more data to fetch");
    }
  };

  fetchContentOnScroll(loadOnScroll, hasMoreData);

  const handleStreamClick = (streamerName: string) => {
    window.location.href = `/${streamerName}`;
  };

  if (hasMoreData && !streams.length) return <LoadingScreen />;

  return (
    <DynamicPageContent className="min-h-screen">
      <div className="pt-8">
        <ListRow
          ref={listRowRef}
          type="stream"
          title={`${categoryName}`}
          description={`Live streams in the ${categoryName} category`}
          items={streams}
          wrap={true}
          onItemClick={handleStreamClick}
          extraClasses="bg-[var(--recommend)]"
          itemExtraClasses="w-[20vw]"
        >
          {isLoggedIn && (
            <Button
              extraClasses="absolute right-10"
              onClick={() => {
                if (categoryName) {
                  isCategoryFollowing
                    ? unfollowCategory(categoryName)
                    : followCategory(categoryName);
                }
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
