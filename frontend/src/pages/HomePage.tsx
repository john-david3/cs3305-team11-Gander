import React from "react";
import ListRow from "../components/Layout/ListRow";
import { useNavigate } from "react-router-dom";
import { useStreams, useCategories, useVods } from "../hooks/useContent";
import Button from "../components/Input/Button";
import DynamicPageContent from "../components/Layout/DynamicPageContent";
import LoadingScreen from "../components/Layout/LoadingScreen";
import Footer from "../components/Layout/Footer";

const HomePage: React.FC = () => {
	const { streams, isLoading: isLoadingStreams } = useStreams();
	const { categories, isLoading: isLoadingCategories } = useCategories();
	const { vods, isLoading: isLoadingVods } = useVods();
	const navigate = useNavigate();

	const handleVodClick = (vodUrl: string) => {
		window.open(vodUrl, "_blank");
	};

	if (isLoadingStreams || isLoadingCategories || isLoadingVods) return <LoadingScreen>Loading Content...</LoadingScreen>;

	return (
		<DynamicPageContent navbarVariant="home" className="relative min-h-screen animate-moving_bg" contentClassName="pb-[12vh]">
			{/* Streams Section */}
			<ListRow
				type="stream"
				title="Streams - Live Now"
				description="Popular streamers that are currently live!"
				items={streams}
				wrap={false}
				onItemClick={(streamerName) => navigate(`/${streamerName}`)}
				extraClasses="bg-[var(--liveNow)]"
				itemExtraClasses="w-[20vw]"
			/>

			{/* Categories Section */}
			<ListRow
				type="category"
				title="Trending Categories"
				description="Recently popular categories lately!"
				items={categories}
				wrap={false}
				onItemClick={(categoryName) => navigate(`/category/${categoryName}`)}
				titleClickable={true}
				extraClasses="bg-[var(--recommend)]"
				itemExtraClasses="w-[20vw]"
			>
				<Button extraClasses="absolute right-10" onClick={() => navigate("/categories")}>
					Show All
				</Button>
			</ListRow>

			{/* VODs Section */}
			<ListRow
				type="vod"
				title="Recent VODs"
				description="Watch the latest recorded streams!"
				items={vods}
				wrap={false}
				onItemClick={handleVodClick}
				extraClasses="bg-black/50"
				itemExtraClasses="w-[20vw]"
			/>
			<Footer />
		</DynamicPageContent>
	);
};

export default HomePage;
