import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/listRow.css";
import { StreamListItem, CategoryListItem, UserListItem, VodListItem } from "./ListItem";
import { StreamType } from "../../types/StreamType";
import { CategoryType } from "../../types/CategoryType";
import { UserType } from "../../types/UserType";
import { VodType } from "../../types/VodType";

type ItemType = StreamType | CategoryType | UserType | VodType;

interface ListRowProps {
	variant?: "default" | "search" | "vodDashboard";
	type: "stream" | "category" | "user" | "vod";
	title?: string;
	description?: string;
	items: ItemType[];
	wrap?: boolean;
	onItemClick: (itemName: string) => void;
	titleClickable?: boolean;
	extraClasses?: string;
	itemExtraClasses?: string;
	amountForScroll?: number;
	children?: React.ReactNode;
}

interface ListRowRef {
	addMoreItems: (newItems: ItemType[]) => void;
}

const ListRow = forwardRef<ListRowRef, ListRowProps>((props, ref) => {
	const {
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
	} = props;

	const [currentItems, setCurrentItems] = useState<ItemType[]>(items);
	const slider = useRef<HTMLDivElement>(null);
	const scrollAmount = window.innerWidth * 0.4;
	const navigate = useNavigate();

	const addMoreItems = (newItems: ItemType[]) => {
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

	const handleTitleClick = () => {
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

	const isStreamType = (item: ItemType): item is StreamType => item.type === "stream";

	const isCategoryType = (item: ItemType): item is CategoryType => item.type === "category";

	const isUserType = (item: ItemType): item is UserType => item.type === "user";

	const isVodType = (item: ItemType): item is VodType => item.type === "vod";

	return (
		<div
			className={`${extraClasses} flex relative rounded-[1.5rem] text-white transition-all ${
				variant === "search" ? "items-center" : "flex-col space-y-4 py-6 px-5 mx-2 mt-5"
			}`}
		>
			{/* List Details */}
			<div className={`text-center ${variant === "search" ? "min-w-fit px-auto w-[15vw]" : ""}`}>
				<h2
					className={`${titleClickable ? "cursor-pointer hover:underline" : "cursor-default"} text-2xl font-bold`}
					onClick={titleClickable ? handleTitleClick : undefined}
				>
					{title}
				</h2>
				<p>{description}</p>
			</div>

			{/* List Items */}
			<div className="relative overflow-hidden flex flex-grow items-center z-0">
				{!wrap && currentItems.length > amountForScroll && (
					<>
						<ArrowLeftIcon onClick={slideLeft} size={30} className="absolute left-0 cursor-pointer z-[999]" />
						<ArrowRightIcon onClick={slideRight} size={30} className="absolute right-0 cursor-pointer z-[999]" />
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
							{currentItems.map((item) => {
								if (type === "stream" && isStreamType(item)) {
									return (
										<StreamListItem
											key={`stream-${item.id}`}
											id={item.id}
											title={item.title}
											username={item.username}
											streamCategory={item.streamCategory}
											viewers={item.viewers}
											thumbnail={item.thumbnail}
											onItemClick={() => onItemClick(item.username)}
											extraClasses={itemExtraClasses}
										/>
									);
								} else if (type === "category" && isCategoryType(item)) {
									return (
										<CategoryListItem
											key={`category-${item.id}`}
											id={item.id}
											title={item.title}
											viewers={item.viewers}
											thumbnail={item.thumbnail}
											onItemClick={() => onItemClick(item.title)}
											extraClasses={itemExtraClasses}
										/>
									);
								} else if (type === "user" && isUserType(item)) {
									return (
										<UserListItem
											key={`user-${item.id}`}
											id={item.id}
											title={item.title}
											username={item.username}
											isLive={item.isLive}
											viewers={item.viewers}
											onItemClick={() => onItemClick(item.username)}
											extraClasses={itemExtraClasses}
										/>
									);
								} else if (type === "vod" && isVodType(item)) {
									return (
										<VodListItem
											key={`vod-${item.vod_id}`}
											vod_id={item.vod_id}
											title={item.title}
											username={item.username}
											datetime={item.datetime}
											category_name={item.category_name}
											length={item.length}
											views={item.views}
											thumbnail={item.thumbnail}
											onItemClick={() => onItemClick(item.vod_id.toString())}
											extraClasses={itemExtraClasses}
											variant={variant}
										/>
									);
								}
								return null;
							})}
						</>
					)}
				</div>
			</div>
			{children}
		</div>
	);
});

export default ListRow;
