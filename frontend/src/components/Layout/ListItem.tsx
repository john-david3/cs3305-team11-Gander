import React from "react";
import { StreamType } from "../../types/StreamType";
import { CategoryType } from "../../types/CategoryType";
import { UserType } from "../../types/UserType";
import { VodType } from "../../types/VodType";
import { DownloadIcon, UploadIcon } from "lucide-react";

// Base props that all item types share
interface BaseListItemProps {
	onItemClick?: () => void;
	extraClasses?: string;
}

// Stream item component
interface StreamListItemProps extends BaseListItemProps, Omit<StreamType, "type"> {}

const StreamListItem: React.FC<StreamListItemProps> = ({
	title,
	username,
	streamCategory,
	viewers,
	thumbnail,
	onItemClick,
	extraClasses = "",
}) => {
	return (
		<div className="p-4">
			<div
				className={`${extraClasses} overflow-hidden flex-shrink-0 flex flex-col bg-purple-900 rounded-lg cursor-pointer mx-auto hover:bg-purple-600 hover:scale-105 transition-all`}
				onClick={onItemClick}
			>
				<div className="relative w-full aspect-video overflow-hidden rounded-t-lg">
					{thumbnail ? (
						<img src={thumbnail} alt={title} className="absolute top-0 left-0 w-full h-full object-cover" />
					) : (
						<div className="absolute top-0 left-0 w-full h-full bg-gray-600" />
					)}
				</div>
				<div className="p-3">
					<h3 className="font-semibold text-lg text-center truncate max-w-full">{title}</h3>
					<p className="font-bold">{username}</p>
					<p className="text-sm text-gray-300">{!window.location.href.includes('/category/') ? streamCategory : ""}</p>
					<p className="text-sm text-gray-300">{viewers} viewers</p>
				</div>
			</div>
		</div>
	);
};

// Category item component
interface CategoryListItemProps extends BaseListItemProps, Omit<CategoryType, "type"> {}

const CategoryListItem: React.FC<CategoryListItemProps> = ({ title, viewers, thumbnail, onItemClick, extraClasses = "" }) => {
	return (
		<div className="p-4">
			<div
				className={`${extraClasses} overflow-hidden flex-shrink-0 flex flex-col bg-purple-900 rounded-lg cursor-pointer mx-auto hover:bg-purple-600 hover:scale-105 transition-all`}
				onClick={onItemClick}
			>
				<div className="relative w-full aspect-video overflow-hidden rounded-t-lg">
					{thumbnail ? (
						<img src={thumbnail} alt={title} className="absolute top-0 left-0 w-full h-full object-cover" />
					) : (
						<div className="absolute top-0 left-0 w-full h-full bg-gray-600" />
					)}
				</div>
				<div className="p-3">
					<h3 className="font-semibold text-lg text-center truncate max-w-full">{title}</h3>
					<p className="text-sm text-gray-300">{viewers} viewers</p>
				</div>
			</div>
		</div>
	);
};

// User item component
interface UserListItemProps extends BaseListItemProps, Omit<UserType, "type"> {}

const UserListItem: React.FC<UserListItemProps> = ({ title, username, isLive, onItemClick, extraClasses = "" }) => {
	return (
		<div className="p-4 pb-10">
			<div
				className={`group relative w-fit flex flex-col bg-purple-900 rounded-tl-xl rounded-xl min-h-[calc((20vw+20vh)/3)] max-w-[calc((27vw+27vh)/2)] justify-end items-center cursor-pointer mx-auto hover:bg-purple-600 hover:scale-105 z-50 transition-all ${extraClasses}`}
				onClick={onItemClick}
			>
				<img
					src={`/user/${username}/profile_picture`}
					onError={(e) => {
						e.currentTarget.src = "/images/pfps/default.png";
						e.currentTarget.onerror = null;
					}}
					alt={`user ${username}`}
					className="rounded-xl border-[0.15em] border-[var(--bg-color)] cursor-pointer"
					style={{ backgroundColor: 'white' }}
				/>
				<button className="text-[calc((2vw+2vh)/2)] font-bold hover:underline w-full py-2">{title}</button>

				{isLive && (
					<p className="absolute font-black bottom-5 opacity-0 group-hover:translate-y-full group-hover:opacity-100 group-hover:-bottom-1 transition-all">
						Currently Live!
					</p>
				)}
			</div>
		</div>
	);
};

// VODs item component
interface VodListItemProps extends BaseListItemProps, Omit<VodType, "type"> {
	variant?: string;
}

const VodListItem: React.FC<VodListItemProps> = ({
	vod_id,
	title,
	username,
	category_name,
	views,
	length,
	datetime,
	thumbnail,
	onItemClick,
	extraClasses = "",
	variant,
}) => {
	return (
		<div className="p-4">
			<div
				className={`${extraClasses} overflow-hidden flex-shrink-0 flex flex-col bg-gray-900 rounded-lg cursor-pointer mx-auto hover:bg-gray-800 hover:scale-105 transition-all`}
				onClick={onItemClick}
			>
				<div className="relative w-full aspect-video overflow-hidden rounded-t-lg">
					{/* Thumbnail */}
					<img src={thumbnail} alt={title} className="absolute top-0 left-0 w-full h-full object-cover" />

					{/* Duration badge */}
					<div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 text-xs rounded">{length}</div>
				</div>

				<div className="p-3">
					<h3 className="font-semibold text-lg text-white truncate max-w-full">{title}</h3>
					{variant != "vodDashboard" && <p className="text-sm text-gray-300">{username}</p>}
					<p className="text-sm text-gray-400">{category_name}</p>
					<div className="flex justify-between items-center mt-2">
						<p className="text-xs text-gray-500">{datetime}</p>
						<p className="text-xs text-gray-500">{views} views</p>
					</div>
				</div>
			</div>
			{variant === "vodDashboard" && (
				<div className="flex justify-evenly items-stretch rounded-b-lg">
					<a
						className="flex justify-around w-full h-full bg-black/50 hover:bg-black/80 p-2 mx-1 font-semibold rounded-full border border-transparent hover:border-white"
						href={`/vods/${username}/${vod_id}.mp4`}
						download={`${username}_vod_${vod_id}.mp4`}
					>
						<DownloadIcon />
						Download
					</a>
				</div>
			)}
		</div>
	);
};

export { StreamListItem, CategoryListItem, UserListItem, VodListItem };
