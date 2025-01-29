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
  onClick: (itemId: number, itemName: string) => void;
}

// Individual list entry component
const ListItem: React.FC<ListItemProps> = ({
  type,
  title,
  streamer,
  viewers,
  thumbnail,
  onItemClick,
}) => {
  console.log(title, "thumbnail", thumbnail);
  return (
    <div
      className="flex flex-col bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-700 transition-colors"
      onClick={onItemClick}
    >
      <div className="relative w-full pt-[56.25%]">
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
        <h3 className="font-semibold text-lg">{title}</h3>
        {type === "stream" && <p className="text-gray-400">{streamer}</p>}
        <p className="text-sm text-gray-500">{viewers} viewers</p>
      </div>
    </div>
  );
};

// Row of entries
const ListRow: React.FC<ListRowProps> = ({
  title,
  description,
  items,
  onClick,
}) => {
  return (
    <div className="flex flex-col space-y-4 py-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-gray-400">{description}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <ListItem
            key={item.id}
            id={item.id}
            type={item.type}
            title={item.title}
            streamer={item.type === "stream" ? (item.streamer) : undefined}
            viewers={item.viewers}
            thumbnail={item.thumbnail}
            onItemClick={() =>
              onClick?.(item.id, item.streamer || item.title)
            }
          />
        ))}
      </div>
    </div>
  );
};

export default ListRow;
