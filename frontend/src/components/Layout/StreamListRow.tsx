import React from "react";

interface StreamItem {
  id: number;
  title: string;
  streamer: string;
  viewers: number;
  thumbnail?: string;
}

interface StreamListEntryProps {
  stream: StreamItem;
  onClick?: () => void;
}

interface StreamListRowProps {
  title: string;
  description: string;
  streams: StreamItem[];
  onStreamClick?: (streamId: string) => void;
}

// Individual stream entry component
const StreamListEntry: React.FC<StreamListEntryProps> = ({ stream, onClick }) => {
  return (
    <div
      className="flex flex-col bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-700 transition-colors"
      onClick={onClick}
    >
      <div className="relative w-full pt-[56.25%]">
        {stream.thumbnail ? (
          <img
            src={`images/`+stream.thumbnail}
            alt={stream.title}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-600" />
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-lg">{stream.title}</h3>
        <p className="text-gray-400">{stream.streamer}</p>
        <p className="text-sm text-gray-500">{stream.viewers} viewers</p>
      </div>
    </div>
  );
};

// Row of stream entries
const StreamListRow: React.FC<StreamListRowProps> = ({
  title,
  description,
  streams,
  onStreamClick,
}) => {
  return (
    <div className="flex flex-col space-y-4 py-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-gray-400">{description}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {streams.map((stream) => (
          <StreamListEntry
            key={stream.id}
            stream={stream}
            onClick={() => onStreamClick?.(stream.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default StreamListRow;
