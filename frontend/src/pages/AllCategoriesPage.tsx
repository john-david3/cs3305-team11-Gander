import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ListRow from "../components/Layout/ListRow";
import DynamicPageContent from "../components/Layout/DynamicPageContent";
import { fetchContentOnScroll } from "../hooks/fetchContentOnScroll";
import LoadingScreen from "../components/Layout/LoadingScreen";
import { CategoryType } from "../types/CategoryType";

const AllCategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [allCategories, setAllCategories] = useState<CategoryType[]>([]);
  const [categoryOffset, setCategoryOffset] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const listRowRef = useRef<any>(null);

  const fetchCategories = async () => {
    if (isLoading && categoryOffset > 0) return [];
    
    try {
      console.log(`Fetching categories with offset: ${categoryOffset}`);
      const response = await fetch(
        `/api/categories/popular/12/${categoryOffset}`
      );
      if (!response.ok) throw new Error("Failed to fetch categories");

      const data = await response.json();
      console.log("Categories fetched:", data.length);

      if (data.length === 0) {
        setHasMoreData(false);
        return [];
      }

      setCategoryOffset(categoryOffset + data.length);

      const newCategories = data.map((category: any) => ({
        type: "category" as const,
        id: category.category_id,
        title: category.category_name,
        viewers: category.num_viewers || 0,
        thumbnail: `/images/category_thumbnails/${category.category_name
          .toLowerCase()
          .replace(/ /g, "_")}.webp`,
      }));

      return newCategories;
    } catch (err) {
      console.error("Error fetching categories:", err);
      setHasMoreData(false);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    const initialLoad = async () => {
      const initialCategories = await fetchCategories();
      setAllCategories(initialCategories);
    };
    
    initialLoad();
  }, []);

  const loadMoreCategories = async () => {
    if (!hasMoreData || (isLoading && categoryOffset > 0)) return;
    
    const newCategories = await fetchCategories();
    if (newCategories.length > 0) {
      setAllCategories(prev => [...prev, ...newCategories]);
      if (listRowRef.current && listRowRef.current.addMoreItems) {
        listRowRef.current.addMoreItems(newCategories);
      }
    }
  };

  // Set up infinite scroll
  fetchContentOnScroll(loadMoreCategories, hasMoreData);

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/category/${categoryName}`);
  };

  if (isLoading && allCategories.length === 0) return <LoadingScreen />;

  return (
    <DynamicPageContent className="min-h-screen">
      <ListRow
        ref={listRowRef}
        type="category"
        title="All Categories"
        items={allCategories}
        onItemClick={handleCategoryClick}
        extraClasses="bg-[var(--recommend)] text-center"
        itemExtraClasses="w-[20vw]"
        wrap={true}
      />
      {!hasMoreData && allCategories.length > 0 && (
        <div className="text-center text-gray-500 p-4">
          No more categories to load
        </div>
      )}
    </DynamicPageContent>
  );
};

export default AllCategoriesPage;