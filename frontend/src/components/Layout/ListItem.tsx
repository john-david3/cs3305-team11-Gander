import React from "react";
import { StreamType } from "../../types/StreamType";
import { CategoryType } from "../../types/CategoryType";
import { UserType } from "../../types/UserType";

// Base props that all item types share
interface BaseListItemProps {
  onItemClick?: () => void;
  extraClasses?: string;
}

// Stream item component
interface StreamListItemProps extends BaseListItemProps, Omit<StreamType, 'type'> {}

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
          <h3 className="font-semibold text-lg text-center truncate max-w-full">
            {title}
          </h3>
          <p className="font-bold">{username}</p>
          <p className="text-sm text-gray-300">{streamCategory}</p>
          <p className="text-sm text-gray-300">{viewers} viewers</p>
        </div>
      </div>
    </div>
  );
};

// Category item component
interface CategoryListItemProps extends BaseListItemProps, Omit<CategoryType, 'type'> {}

const CategoryListItem: React.FC<CategoryListItemProps> = ({
  title,
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
          <h3 className="font-semibold text-lg text-center truncate max-w-full">
            {title}
          </h3>
          <p className="text-sm text-gray-300">{viewers} viewers</p>
        </div>
      </div>
    </div>
  );
};

// User item component
interface UserListItemProps extends BaseListItemProps, Omit<UserType, 'type'> {}

const UserListItem: React.FC<UserListItemProps> = ({
  title,
  username,
  isLive,
  onItemClick,
  extraClasses = "",
}) => {
  return (
    <div className="p-4 pb-10">
      <div
        className={`group relative w-fit flex flex-col bg-purple-900 rounded-tl-xl rounded-xl min-h-[calc((20vw+20vh)/3)] max-w-[calc((27vw+27vh)/2)] justify-end items-center cursor-pointer mx-auto hover:bg-purple-600 hover:scale-105 z-50 transition-all ${extraClasses}`}
        onClick={onItemClick}
      >
        <img
          src="/images/monkey.png"
          alt={`user ${username}`}
          className="rounded-xl border-[0.15em] border-[var(--bg-color)] cursor-pointer"
        />
        <button className="text-[calc((2vw+2vh)/2)] font-bold hover:underline w-full py-2">
          {title}
        </button>

        {isLive && (
          <p className="absolute font-black bottom-5 opacity-0 group-hover:translate-y-full group-hover:opacity-100 group-hover:-bottom-1 transition-all">
            Currently Live!
          </p>
        )}
      </div>
    </div>
  );
};

// Legacy wrapper component for backward compatibility
export interface ListItemProps {
  type: "stream" | "category" | "user";
  id: number;
  title: string;
  username?: string;
  streamCategory?: string;
  viewers: number;
  thumbnail?: string;
  onItemClick?: () => void;
  extraClasses?: string;
  isLive?: boolean;
}

export { StreamListItem, CategoryListItem, UserListItem };