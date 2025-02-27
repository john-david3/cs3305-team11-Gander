import React from "react";
import ListRow from "../components/Layout/ListRow";
import { useNavigate } from "react-router-dom";
import { useStreams, useCategories } from "../hooks/useContent";
import Button from "../components/Input/Button";
import DynamicPageContent from "../components/Layout/DynamicPageContent";
import LoadingScreen from "../components/Layout/LoadingScreen";
import Footer from "../components/Layout/Footer";

interface HomePageProps {
  variant?: "default" | "personalised";
}

const HomePage: React.FC<HomePageProps> = ({ variant = "default" }) => {
  const { streams, isLoading: isLoadingStreams } = useStreams();
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const navigate = useNavigate();

  const handleStreamClick = (streamerName: string) => {
    window.location.href = `/${streamerName}`;
  };

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/category/${categoryName}`);
  };

  if (isLoadingStreams || isLoadingCategories) {
    console.log("No content found yet");
    return <LoadingScreen>Loading Content...</LoadingScreen>;
  }

  return (
    <DynamicPageContent
      navbarVariant="home"
      className="relative min-h-screen animate-moving_bg"
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
        itemExtraClasses="w-[20vw]"
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
        itemExtraClasses="w-[20vw]"
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
