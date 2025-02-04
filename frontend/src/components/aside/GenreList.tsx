import React from 'react'
import { useState } from "react";

interface GenreListProps {

}

const GenreList: React.FC<GenreListProps> = () => {

  const [genres, setGenres] = useState(true)


  return (
    <div>GenreList</div>
  )
}

export default GenreList;