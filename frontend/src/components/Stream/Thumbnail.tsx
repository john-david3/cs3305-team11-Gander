import React from 'react'

interface ThumbnailProps {
	path: string;
	alt?: string;
}

const Thumbnail = ({ path, alt }: ThumbnailProps) => {
  return (
	<div id='stream-thumbnail'>
      <img
        width={300}
              src={path}
              alt={alt}
              className="rounded-md"
            />
	</div>
  )
}

export default Thumbnail
