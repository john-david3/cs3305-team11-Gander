import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ListRow from "../components/Layout/ListRow";
import { useCategories } from "../context/ContentContext";
import DynamicPageContent from "../components/Layout/DynamicPageContent";

const AllCategoriesPage: React.FC = () => {
  const { categories, setCategories } = useCategories();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories/popular/8/0");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();

        // Transform the data to match CategoryItem interface
        const processedCategories = data.map((category: any) => ({
          type: "category" as const,
          id: category.category_id,
          title: category.category_name,
          viewers: category.num_viewers,
          thumbnail: `/images/thumbnails/categories/${category.category_name
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
