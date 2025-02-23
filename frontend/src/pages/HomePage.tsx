import React from "react";
import ListRow from "../components/Layout/ListRow";
import { useNavigate } from "react-router-dom";
import { useStreams, useCategories } from "../context/ContentContext";
import Button from "../components/Input/Button";
import DynamicPageContent from "../components/Layout/DynamicPageContent";

interface HomePageProps {
  variant?: "default" | "personalised";
}

const HomePage: React.FC<HomePageProps> = ({ variant = "default" }) => {
  const { streams } = useStreams();
  const { categories } = useCategories();
  const navigate = useNavigate();

  const handleStreamClick = (streamerName: string) => {
    window.location.href = `/${streamerName}`;
  };

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/category/${categoryName}`);
  };

  if (!categories || categories.length === 0) {
    return <div>Loading categories...</div>;
  }

  return (
    <DynamicPageContent
      navbarVariant="home"
      className="h-full min-h-screen animate-moving_bg"
      style={{ backgroundImage: "url(/images/background-pattern.svg)" }}
    >
      <ListRow
        type="stream"
        title={
          "Streams - Live Now" +
          (variant === "personalised" ? " - Recommended" : "")
        }
        description={
          variant === "personalised"
            ? "We think you might like these streams - Streamers recommended for you"
            : "Popular streamers that are currently live!"
        }
        items={streams}
        wrap={false}
        onItemClick={handleStreamClick}
        extraClasses="bg-[var(--liveNow)]"
      />

      {/* If Personalised_HomePage, display Categories the logged-in user follows. Else, trending categories. */}
      <ListRow
        type="category"
        title={
          variant === "personalised"
            ? "Followed Categories"
            : "Trending Categories"
        }
        description={
          variant === "personalised"
            ? "Current streams from your followed categories"
            : "Recently popular categories lately!"
        }
        items={categories}
        wrap={false}
        onItemClick={handleCategoryClick}
        titleClickable={true}
        extraClasses="bg-[var(--recommend)]"
      >
        <Button
          extraClasses="absolute right-10"
          onClick={() => navigate("/categories")}
        >
          Show More
        </Button>
      </ListRow>
    </DynamicPageContent>
  );
};

export default HomePage;
