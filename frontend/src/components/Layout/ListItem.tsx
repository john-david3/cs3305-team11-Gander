import React from "react";

export interface ListItemProps {
  type: "stream" | "category";
  id: number;
  title: string;
  streamer?: string;
  streamCategory?: string;
  viewers: number;
  thumbnail?: string;
  onItemClick?: () => void;
}

const ListItem: React.FC<ListItemProps> = ({
  type,
  title,
  streamer,
  streamCategory,
  viewers,
  thumbnail,
  onItemClick,
}) => {
  return (
    <div className="p-4">
      <div
        className="min-w-[20vw] overflow-hidden flex-shrink-0 flex flex-col bg-purple-900 rounded-lg 
	   cursor-pointer hover:bg-pink-700 hover:scale-105 transition-all"
        onClick={onItemClick}
      >
        <div className="relative w-full pt-[56.25%] overflow-hidden rounded-t-lg">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute top-0 left-0 w-full h-full bg-gray-600" />
          )}
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-lg text-center">{title}</h3>
          {type === "stream" && <p className="font-bold">{streamer}</p>}
          {type === "stream" && (
            <p className="text-sm text-gray-300">{streamCategory}</p>
          )}
          <p className="text-sm text-gray-300">{viewers} viewers</p>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
