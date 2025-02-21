import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListRow from "../components/Layout/ListRow";
import { useCategories } from "../context/ContentContext";
import DynamicPageContent from "../components/Layout/DynamicPageContent";
import { fetchContentOnScroll } from "../hooks/fetchContentOnScroll";

const AllCategoriesPage: React.FC = () => {
  const { categories, setCategories } = useCategories();
  const navigate = useNavigate();
  const [categoryOffset, setCategoryOffset] = useState(0);
  const [noCategories, setNoCategories] = useState(12);
  const [hasMoreData, setHasMoreData] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api/categories/popular/${noCategories}/${categoryOffset}`);
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        // Adds to offset once data is returned
        if (data.length > 0) {
          setCategoryOffset(prev => prev + data.length);
        } else {
          setHasMoreData(false);
        }

        // Transform the data to match CategoryItem interface
        const processedCategories = data.map((category: any) => ({
          type: "category" as const,
          id: category.category_id,
          title: category.category_name,
          viewers: category.num_viewers,
          thumbnail: `/images/category_thumbnails/${category.category_name
            .toLowerCase()
            .replace(/ /g, "_")}.webp`,
        }));

        setCategories(processedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [setCategories]);

  const logOnScroll = () => {
    console.log("hi")
  };
  fetchContentOnScroll(logOnScroll,hasMoreData)

  if (!categories.length) {
    return (
      <div className="h-screen w-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  const handleCategoryClick = (categoryName: string) => {
    console.log(categoryName);
    navigate(`/category/${categoryName}`);
  };

  return (
    <DynamicPageContent
      className="min-h-screen bg-gradient-radial from-[#ff00f1] via-[#0400ff] to-[#ff0000]"
      style={{ backgroundImage: "url(/images/background-pattern.svg)" }}
    >
      <ListRow
        type="category"
        title="All Categories"
        items={categories}
        onClick={handleCategoryClick}
        extraClasses="bg-[var(--recommend)] text-center"
        wrap={true}

      />
    </DynamicPageContent>
  );
};

export default AllCategoriesPage;
