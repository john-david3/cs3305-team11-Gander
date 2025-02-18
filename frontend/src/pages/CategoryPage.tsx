import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ListRow from "../components/Layout/ListRow";
import { useNavigate } from "react-router-dom";
import DynamicPageContent from "../components/Layout/DynamicPageContent";

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
  const { category_name } = useParams<{ category_name: string }>();
  const [streams, setStreams] = useState<StreamData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoryStreams = async () => {
      try {
        const response = await fetch(`/api/streams/popular/${category_name}`);
        if (!response.ok) {
          throw new Error("Failed to fetch category streams");
        }
        const data = await response.json();
        const formattedData = data.map((stream: any) => ({
          type: "stream",
          id: stream.user_id,
          title: stream.title,
          streamer: stream.username,
          streamCategory: category_name,
          viewers: stream.num_viewers,
          thumbnail:
            stream.thumbnail ||
            (category_name &&
              `/images/thumbnails/categories/${category_name
                .toLowerCase()
                .replace(/ /g, "_")}.webp`),
        }));
        setStreams(formattedData);
      } catch (error) {
        console.error("Error fetching category streams:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryStreams();
  }, [category_name]);

  const handleStreamClick = (streamerName: string) => {
    navigate(`/${streamerName}`);
  };

  if (isLoading) {
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
          title={`${category_name} Streams`}
          description={`Live streams in the ${category_name} category`}
          items={streams}
          wrap={true}
          onClick={handleStreamClick}
          extraClasses="bg-[var(--recommend)]"
        />
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
