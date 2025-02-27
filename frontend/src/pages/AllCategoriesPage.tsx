import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ListRow from "../components/Layout/ListRow";
import DynamicPageContent from "../components/Layout/DynamicPageContent";
import { fetchContentOnScroll } from "../hooks/fetchContentOnScroll";
import LoadingScreen from "../components/Layout/LoadingScreen";
import { CategoryType } from "../types/CategoryType";
import { getCategoryThumbnail } from "../utils/thumbnailUtils";

const AllCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
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
      const response = await fetch(`/api/categories/popular/${noCategories}/${categoryOffset}`);
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      
      if (data.length === 0) {
        setHasMoreData(false);
        return [];
      }

      setCategoryOffset(prev => prev + data.length);

      const processedCategories = data.map((category: any) => ({
        type: "category" as const,
        id: category.category_id,
        title: category.category_name,
        viewers: category.num_viewers,
        thumbnail: getCategoryThumbnail(category.category_name)
      }));

      setCategories(prev => [...prev, ...processedCategories]);
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

  if (hasMoreData && !categories.length) return <LoadingScreen />;

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
        itemExtraClasses="w-[20vw]"
        wrap={true}
      />
      {!hasMoreData && !categories.length && (
        <div className="text-center text-gray-500 p-4">
          No more categories to load
        </div>
      )}
    </DynamicPageContent>
  );
};

export default AllCategoriesPage;