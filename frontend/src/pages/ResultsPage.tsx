import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResultsPage: React.FC = ({}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchResults, query } = location.state || {
    searchResults: null,
    query: "",
  };
  if (!searchResults) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold">No results found for "{query}"</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-purple-500 text-white rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Search Results for "{query}"</h2>

      <div>
        <h3 className="text-lg font-semibold">Categories</h3>
        <ul>
          {searchResults.categories.map((category: any, index: number) => (
            <li key={index} className="border p-2 rounded my-2">
              {category.category_name}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Users</h3>
        <ul>
          {searchResults.users.map((user: any, index: number) => (
            <li key={index} className="border p-2 rounded my-2">
              {user.username} {user.is_live ? "🔴" : ""}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Streams</h3>
        <ul>
          {searchResults.streams.map((stream: any, index: number) => (
            <li key={index} className="border p-2 rounded my-2">
              {stream.title} - {stream.num_viewers} viewers
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="mt-4 px-4 py-2 bg-purple-500 text-white rounded"
      >
        Go Back
      </button>
    </div>
  );
};

export default ResultsPage;
