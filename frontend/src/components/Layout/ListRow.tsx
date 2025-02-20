import React, { useRef } from "react";
import {
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
} from "lucide-react";
import "../../assets/styles/listRow.css";
import ListItem, { ListItemProps } from "./ListItem";

interface ListRowProps {
  type: "stream" | "category" | "user";
  title?: string;
  description?: string;
  items: ListItemProps[];
  wrap: boolean;
  onClick: (itemName: string) => void;
  extraClasses?: string;
  children?: React.ReactNode;
}

// Row of entries
const ListRow: React.FC<ListRowProps> = ({
  title = "",
  description = "",
  items,
  wrap,
  onClick,
  extraClasses = "",
  children,
}) => {
  const slider = useRef<HTMLDivElement>(null);
  const scrollAmount = window.innerWidth * 0.3;

  const slideRight = () => {
    if (!wrap && slider.current) {
      slider.current.scrollBy({ left: +scrollAmount, behavior: "smooth" });
    }
  };

  const slideLeft = () => {
    if (!wrap && slider.current) {
      slider.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div
      className={`flex flex-col w-full space-y-4 py-6 text-white px-5 mx-2 mt-5 rounded-[1.5rem] transition-all ${extraClasses}`}
    >
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p>{description}</p>
      </div>

      <div className="relative overflow-hidden flex items-center z-0">
        {!wrap && items.length > 4 && (
          <>
            <ArrowLeftIcon
              onClick={slideLeft}
              size={30}
              className="absolute left-0 cursor-pointer z-[999]"
            />
            <ArrowRightIcon
              onClick={slideRight}
              size={30}
              className="absolute right-0 cursor-pointer z-[999]"
            />
          </>
        )}

        <div
          ref={slider}
          className={`flex ${
            wrap ? "flex-wrap" : "overflow-x-scroll whitespace-nowrap"
          } items-center justify-between scroll-smooth scrollbar-hide gap-5 py-[10px] px=[30px] mx-[30px]`}
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
      </div>

      {children}
    </div>
  );
};

export default ListRow;