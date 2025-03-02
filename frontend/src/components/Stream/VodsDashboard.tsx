import React from "react";
import ListRow from "../Layout/ListRow";
import { VodType } from "../../types/VodType";

interface VodsDashboardProps {
	vods: VodType[];
}

const VodsDashboard: React.FC<VodsDashboardProps> = ({ vods }) => {
	const handleVodClick = (vodUrl: string) => {
		window.open(vodUrl, "_blank");
	};

	return (
		<div className="w-full">
			<h2 className="text-3xl font-bold text-white mb-6">Past Broadcasts</h2>

			{vods.length === 0 ? (
				<div className="text-center text-gray-400 py-8">
					<p>No past broadcasts found</p>
				</div>
			) : (
				<ListRow
					type="vod"
					variant="vodDashboard"
					items={vods}
					wrap={false}
					onItemClick={handleVodClick}
					extraClasses="bg-black/50"
					itemExtraClasses="w-[20vw]"
				/>
			)}
		</div>
	);
};

export default VodsDashboard;
