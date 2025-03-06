import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import DynamicPageContent from "../components/Layout/DynamicPageContent";
import { useVods } from "../hooks/useContent";
import ListRow from "../components/Layout/ListRow";
import LoadingScreen from "../components/Layout/LoadingScreen";

const VodsPage: React.FC = () => {
	const { username } = useParams<{ username?: string }>();
	const { vods, isLoading, error } = useVods(`/api/vods/${username}`);
	const navigate = useNavigate();

	if (isLoading) return <LoadingScreen>Loading VODs...</LoadingScreen>;
	if (error) return <LoadingScreen>Error loading VODs: {error}</LoadingScreen>;

	return (
		<DynamicPageContent className="h-full">
			<div className="mt-[3em] flex justify-center">
				<div id="vods-container" className="w-[96vw] bg-slate-50/35 rounded-lg p-4 overflow-x-auto whitespace-nowrap scrollbar-hide pb-7">
					<h1 className="text-2xl font-bold text-center mb-4"></h1>
					<ListRow
						type="vod"
						title={`${username}'s VODs`}
						items={vods}
						wrap={true}
						onItemClick={(user, vodId) => navigate(`/vods/${user}/${vodId}`)}
						extraClasses="bg-black/50"
						itemExtraClasses="w-[30vw]"
					/>
				</div>
			</div>
		</DynamicPageContent>
	);
};

export default VodsPage;
