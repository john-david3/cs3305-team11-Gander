import React, { useState, useEffect } from "react";
import Navbar from "../components/Layout/Navbar";
import { useNavigate } from "react-router-dom";

const CategoriesPage: React.FC = () => {
  const [noCategories, setNoCategories] = useState<number>(0);
  const [moreCategories, setMoreCategories] = useState<number>(12);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`api/categories/popular/${moreCategories}`)
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [noCategories]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  const handleCategoryClick = (category_name: string) => {
    navigate(`/category${category_name}`);
  };

  return (
    <div
      className="min-h-screen bg-gradient-radial from-[#ff00f1] via-[#0400ff] to-[#ff0000]"
      style={{ backgroundImage: "url(/images/background-pattern.svg)" }}
    >
      <Navbar />
      <h1>Categories Page</h1>
    </div>
  );
};

export default CategoriesPage;
