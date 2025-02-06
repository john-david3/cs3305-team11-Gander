import React from "react";

interface ListItemProps {
  type: "stream" | "category";
  id: number;
  title: string;
  streamer?: string;
  viewers: number;
  thumbnail?: string;
  onItemClick?: () => void;
}

interface ListRowProps {
  type: "stream" | "category";
  title: string;
  description: string;
  items: ListItemProps[];
  extraClasses?: string;
  onClick: (itemId: number, itemName: string) => void;
}

// Row of entries
const ListRow: React.FC<ListRowProps> = ({
  title,
  description,
  items,
  onClick,
  extraClasses="",
}) => {
  return (
    <div className={`flex flex-col space-y-4 py-6 bg-black/50 text-white px-5 mx-2 mt-5 rounded-[1.5rem] ${extraClasses}`}>
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p>{description}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <ListItem
            key={`${item.type}-${item.id}`}
            id={item.id}
            type={item.type}
            title={item.title}
            streamer={item.type === "stream" ? item.streamer : undefined}
            viewers={item.viewers}
            thumbnail={item.thumbnail}
            onItemClick={() => onClick?.(item.id, item.streamer || item.title)}
          />
        ))}
      </div>
    </div>
  );
};

// Individual list entry component
const ListItem: React.FC<ListItemProps> = ({
  type,
  title,
  streamer,
  viewers,
  thumbnail,
  onItemClick,
}) => {
  return (
    <div
      className="flex flex-col bg-purple-900 rounded-lg overflow-hidden cursor-pointer hover:bg-pink-700 hover:scale-105 transition-all"
      onClick={onItemClick}
    >
      <div className="relative w-full pt-[56.25%] ">
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
        <p className="text-sm text-gray-300">{viewers} viewers</p>
      </div>
    </div>
  );
};

export default ListRow;
