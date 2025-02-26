import {
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
} from "lucide-react";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/listRow.css";
import ListItem, { ListItemProps } from "./ListItem";

interface ListRowProps {
  variant?: "default" | "search";
  type: "stream" | "category" | "user";
  title?: string;
  description?: string;
  items: ListItemProps[];
  wrap?: boolean;
  onItemClick: (itemName: string) => void;
  titleClickable?: boolean;
  extraClasses?: string;
  itemExtraClasses?: string;
  amountForScroll?: number;
  children?: React.ReactNode;
}

const ListRow = forwardRef<
  { addMoreItems: (newItems: ListItemProps[]) => void },
  ListRowProps
>(
  (
    {
      variant = "default",
      type,
      title = "",
      description = "",
      items,
      onItemClick,
      titleClickable = false,
      wrap = false,
      extraClasses = "",
      itemExtraClasses = "",
      amountForScroll = 4,
      children,
    },
    ref
  ) => {
    const [currentItems, setCurrentItems] = useState(items);
    const slider = useRef<HTMLDivElement>(null);
    const scrollAmount = window.innerWidth * 0.3;
    const navigate = useNavigate();

    const addMoreItems = (newItems: ListItemProps[]) => {
      setCurrentItems((prevItems) => [...prevItems, ...newItems]);
    };

    useImperativeHandle(ref, () => ({
      addMoreItems,
    }));

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

    const handleTitleClick = (type: string) => {
      switch (type) {
        case "stream":
          break;
        case "category":
          navigate("/categories");
          break;
        case "user":
          break;
        default:
          break;
      }
    };

    return (
      <div
        className={`${extraClasses} flex relative rounded-[1.5rem] text-white transition-all ${
          variant === "search"
            ? "items-center"
            : "flex-col space-y-4 py-6 px-5 mx-2 mt-5"
        }`}
      >
        {/* List Details */}
        <div
          className={`text-center ${
            variant === "search" ? "min-w-fit px-auto w-[15vw]" : ""
          }`}
        >
          <h2
            className={`${
              titleClickable
                ? "cursor-pointer hover:underline"
                : "cursor-default"
            } text-2xl font-bold`}
            onClick={titleClickable ? () => handleTitleClick(type) : undefined}
          >
            {title}
          </h2>
          <p>{description}</p>
        </div>

        {/* List Items */}
        <div className="relative overflow-hidden flex flex-grow items-center z-0">
          {!wrap && currentItems.length > amountForScroll && (
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
              wrap ? "flex-wrap justify-between" : "overflow-x-scroll whitespace-nowrap"
            } max-w-[95%] items-center w-full mx-auto scroll-smooth scrollbar-hide`}
          >
            {currentItems.length === 0 ? (
              <h1 className="mx-auto">Nothing Found</h1>
            ) : (
              <>
                {currentItems.map((item) => (
                  <ListItem
                    key={`${item.type}-${item.id}`}
                    id={item.id}
                    type={type}
                    title={item.title}
                    username={
                      item.type === "category" ? undefined : item.username
                    }
                    streamCategory={
                      item.type === "stream" ? item.streamCategory : undefined
                    }
                    viewers={item.viewers}
                    thumbnail={item.thumbnail}
                    onItemClick={() =>
                      (item.type === "stream" || item.type === "user") &&
                      item.username
                        ? onItemClick?.(item.username)
                        : onItemClick?.(item.title)
                    }
                    extraClasses={`${itemExtraClasses}`}
                  />
                ))}
              </>
            )}
          </div>
        </div>
        {children}
      </div>
    );
  }
);

export default ListRow;
