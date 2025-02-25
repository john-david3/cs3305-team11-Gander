import React from "react";
import ListRow from "../components/Layout/ListRow";
import { useNavigate } from "react-router-dom";
import { useStreams, useCategories } from "../context/ContentContext";
import Button from "../components/Input/Button";
import DynamicPageContent from "../components/Layout/DynamicPageContent";
import LoadingScreen from "../components/Layout/LoadingScreen";
import Footer from "../components/Layout/Footer";

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
    return <LoadingScreen>Loading Categories...</LoadingScreen>;
  }

  return (
    <DynamicPageContent
      navbarVariant="home"
      className="h-full min-h-screen bg-[url(/images/background-pattern.svg)] animate-moving_bg"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
            {/* Hide Scrollbar for WebKit-based Browsers */}
            <style>
        {`
          ::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
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
      <Footer/>
    </DynamicPageContent>
  );
};

export default HomePage;
