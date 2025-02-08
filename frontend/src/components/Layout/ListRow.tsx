import React, { useRef } from "react";
import { ArrowLeft as ArrowLeftIcon, ArrowRight as ArrowRightIcon } from "lucide-react";
import "../../assets/styles/listRow.css"

interface ListItemProps {
  type: "stream" | "category";
  id: number;
  title: string;
  streamer?: string;
  streamCategory?: string;
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
  onClick: (itemName: string) => void;
}

// Row of entries
const ListRow: React.FC<ListRowProps> = ({
  title,
  description,
  items,
  onClick,
  extraClasses = "",
}) => {
  const slider = useRef<HTMLDivElement>(null);

  const slideRight = () => {
    if (slider.current) {
      slider.current.scrollBy({ left: +200, behavior: "smooth" });
    }
  };

  const slideLeft = () => {
    if (slider.current) {
      slider.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  return (
    <div
      className={`flex flex-col space-y-4 py-6 bg-black/50 text-white px-5 mx-2 mt-5 rounded-[1.5rem] ${extraClasses}`}
    >
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p>{description}</p>
      </div>
      
      <div className="relative overflow-hidden flex items-center z-0">

        <ArrowLeftIcon onClick={slideLeft} size={20} className="mr-1 cursor-pointer" />

        <div
          ref={slider}
          className="flex overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide gap-5"
          style={{ scrollbarWidth: 'none', padding: "10px"}}
        >
          {items.map((item) => (
            <ListItem
              key={`${item.type}-${item.id}`}
              id={item.id}
              type={item.type}
              title={item.title}
              streamer={item.type === "stream" ? item.streamer : undefined}
              streamCategory={
                item.type === "stream" ? item.streamCategory : undefined
              }
              viewers={item.viewers}
              thumbnail={item.thumbnail}
              onItemClick={() =>
                item.type === "stream" && item.streamer
                  ? onClick?.(item.streamer)
                  : onClick?.(item.title)
              }
            />
          ))}
        </div>

        <ArrowRightIcon onClick={slideRight} size={20} className="relative left-[10px] cursor-pointer" />

      </div>
    </div>
  );
};

// Individual list entry component
export const ListItem: React.FC<ListItemProps> = ({
  type,
  title,
  streamer,
  streamCategory,
  viewers,
  thumbnail,
  onItemClick,  
}) => {
  return (
    <div className="">
    <div
      className="min-w-[430px] overflow-hidden flex-shrink-0 flex flex-col bg-purple-900 rounded-lg 
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

export default ListRow;
