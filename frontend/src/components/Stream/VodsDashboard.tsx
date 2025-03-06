import React from "react";
import ListRow from "../Layout/ListRow";
import { VodType } from "../../types/VodType";
import { useNavigate } from "react-router-dom";

interface VodsDashboardProps {
  vods: VodType[];
}

const VodsDashboard: React.FC<VodsDashboardProps> = ({ vods }) => {
  const navigate = useNavigate();

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
          onItemClick={(username, vodId) => navigate(`/vods/${username}/${vodId}`) }
          extraClasses="bg-black/50"
          itemExtraClasses="w-[20vw]"
        />
      )}
    </div>
  );
};

export default VodsDashboard;
