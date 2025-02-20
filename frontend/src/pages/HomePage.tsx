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
    navigate(`/${streamerName}`);
  };

  const handleCategoryClick = (categoryName: string) => {
    navigate(`category/${categoryName}`);
  };

  return (
    <DynamicPageContent
      navbarVariant="home"
      className="h-full min-h-screen animate-moving_bg"
      style={{ backgroundImage: "url(/images/background-pattern.svg)" }}
    >
      {/* If Personalised_HomePage, display Streams recommended for the logged-in user. Else, live streams with the most viewers. */}
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
        onClick={handleStreamClick}
        extraClasses="bg-[var(--liveNow)]"

      >
        {/* <Button extraClasses="absolute right-10" onClick={() => navigate("/")}>
          Show More . . .
        </Button> */}
      </ListRow>

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
        onClick={handleCategoryClick}
        extraClasses="bg-[var(--recommend)]"
      >
        <Button
          extraClasses="absolute right-10"
          onClick={() => navigate("/categories")}
        >
          Show More . . .
        </Button>
      </ListRow>
    </DynamicPageContent>
  );
};

export default HomePage;
