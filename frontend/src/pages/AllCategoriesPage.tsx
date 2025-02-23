import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ListRow from "../components/Layout/ListRow";
import DynamicPageContent from "../components/Layout/DynamicPageContent";
import { fetchContentOnScroll } from "../hooks/fetchContentOnScroll";

interface categoryData {
  type: "category";
  id: number;
  title: string;
  viewers: number;
  thumbnail: string;
}
const AllCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<categoryData[]>([]);
  const navigate = useNavigate();
  const [categoryOffset, setCategoryOffset] = useState(0);
  const [noCategories, setNoCategories] = useState(12);
  const [hasMoreData, setHasMoreData] = useState(true);

  const listRowRef = useRef<any>(null);
  const isLoading = useRef(false);

  const fetchCategories = async () => {
    // If already loading, skip this fetch
    if (isLoading.current) return;

    isLoading.current = true;

    try {
      const response = await fetch(
        `/api/categories/popular/${noCategories}/${categoryOffset}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();

      if (data.length === 0) {
        setHasMoreData(false);
        return [];
      }

      setCategoryOffset((prev) => prev + data.length);

      const processedCategories = data.map((category: any) => ({
        type: "category" as const,
        id: category.category_id,
        title: category.category_name,
        viewers: category.num_viewers,
        thumbnail: `/images/category_thumbnails/${category.category_name
          .toLowerCase()
          .replace(/ /g, "_")}.webp`,
      }));

      setCategories((prev) => [...prev, ...processedCategories]);
      return processedCategories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    } finally {
      isLoading.current = false;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const loadOnScroll = async () => {
    if (hasMoreData && listRowRef.current) {
      const newCategories = await fetchCategories();
      if (newCategories?.length > 0) {
        listRowRef.current.addMoreItems(newCategories);
      }
    }
  };

  fetchContentOnScroll(loadOnScroll, hasMoreData);

  if (hasMoreData && !categories.length) {
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
        ref={listRowRef}
        type="category"
        title="All Categories"
        items={categories}
        onItemClick={handleCategoryClick}
        extraClasses="bg-[var(--recommend)] text-center"
        wrap={true}
      />
    </DynamicPageContent>
  );
};

export default AllCategoriesPage;
