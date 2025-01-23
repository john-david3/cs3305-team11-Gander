import React from 'react'

interface ThumbnailProps {
	path: string;
	alt?: string;
}

const Thumbnail = ({ path, alt }: ThumbnailProps) => {
  return (
	<div>
      <img
        width={300}
              src={path}
              alt={alt}
              className="stream-thumbnail rounded-md"
            />
	</div>
  )
}

export default Thumbnail
