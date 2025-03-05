import React from "react";
import ListRow from "../Layout/ListRow";
import { VodType } from "../../types/VodType";
import { useNavigate } from "react-router-dom";

interface VodsDashboardProps {
  vods: VodType[];
}

const VodsDashboard: React.FC<VodsDashboardProps> = ({ vods }) => {
  const navigate = useNavigate();

  const handleVodClick = (vodId: string) => {
    if (vods.length > 0) {
      navigate(`/stream/${vods[0].username}/vods/${vodId}`);
    }
  };

  // Ensure each VOD has a hardcoded thumbnail path
  const thumbnails = vods.map((vod) => ({
    ...vod,
    thumbnail: `/vods/${vod.username}/${vod.vod_id}.png`,
  }));

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
          items={thumbnails} // Use modified VODs with hardcoded thumbnail
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
