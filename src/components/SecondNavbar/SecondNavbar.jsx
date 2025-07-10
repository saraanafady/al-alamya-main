import React, { useState, useEffect, useRef } from "react";
import "./SecondNavbar.css";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useCategory } from "../../context/CategoryContext";

const fetchCategories = async () => {
  const { data } = await axios.get("http://127.0.0.1:3000/api/categories");
  return data.data;
};

const SecondNavbar = () => {
  const navigate = useNavigate();
  const { selectedCategory, setSelectedCategory } = useCategory();
  const [isSticky, setIsSticky] = useState(false);
  const { i18n } = useTranslation();
  const language = i18n.language === "ar" ? "ar" : "en";
  const prevLang = useRef(language);

  // Handle scroll for sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsSticky(scrollTop > 150);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // عند تغيير اللغة، ابحث عن التصنيف الحالي وخذ دومًا السلاج الإنجليزي
  useEffect(() => {
    if (!categories) return;
    if (prevLang.current !== language) {
      if (selectedCategory !== "all") {
        // ابحث عن التصنيف الحالي في جميع لغات السلاج
        const currentCat = categories.find((cat) => {
          if (typeof cat.slug === "object") {
            return Object.values(cat.slug)
              .map((s) => (s ? s.toLowerCase() : s))
              .includes(selectedCategory.toLowerCase());
          }
          return (
            cat.slug &&
            cat.slug.toLowerCase() === selectedCategory.toLowerCase()
          );
        });
        if (currentCat) {
          const newSlug =
            typeof currentCat.slug === "object"
              ? currentCat.slug["en"] // دومًا السلاج الإنجليزي
              : currentCat.slug;
          setSelectedCategory(newSlug ? newSlug.toLowerCase() : "all");
        } else {
          setSelectedCategory("all");
        }
      }
      prevLang.current = language;
    }
  }, [language, categories, selectedCategory]);

  // عند الضغط على تصنيف، دومًا خزّن السلاج الإنجليزي
  const handleCategoryClick = (slug) => {
    setSelectedCategory(slug);
    navigate(`/products?category=${slug}`);
  };

  return (
    <nav className={`second-navbar ${isSticky ? "sticky" : ""}`}>
      <div className="second-navbar-container">
        {/* Categories Navigation */}
        <div className="categories-nav">
          <div className="categories-scroll">
            <button
              className={`category-btn ${
                selectedCategory === "all" ? "active" : ""
              }`}
              onClick={() => handleCategoryClick("all")}
            >
              <span className="category-label">
                {language === "ar" ? "الكل" : "All"}
              </span>
            </button>
            {!isLoading &&
              categories?.map((cat) => {
                const catName =
                  typeof cat.name === "object"
                    ? cat.name[language] || cat.name["en"] || cat.name["ar"]
                    : cat.name;
                const catSlugEn =
                  typeof cat.slug === "object" ? cat.slug["en"] : cat.slug;
                return (
                  <button
                    key={cat._id}
                    className={`category-btn ${
                      selectedCategory ===
                      (catSlugEn ? catSlugEn.toLowerCase() : "")
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleCategoryClick(
                        catSlugEn ? catSlugEn.toLowerCase() : ""
                      )
                    }
                  >
                    <span className="category-label">{catName}</span>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="quick-action-btn filter-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
            </svg>
            <span>Filter</span>
          </button>

          <button className="quick-action-btn sort-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 6h18M7 12h10m-7 6h4" />
            </svg>
            <span>Sort</span>
          </button>

          <button className="quick-action-btn view-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <span>Grid</span>
          </button>
        </div>
      </div>

      {/* Mobile Category Selector */}
      <div className="mobile-category-selector">
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryClick(e.target.value)}
          className="mobile-category-select"
        >
          <option value="all">{language === "ar" ? "الكل" : "All"}</option>
          {categories?.map((category) => {
            const catName =
              typeof category.name === "object"
                ? category.name[language] ||
                  category.name["en"] ||
                  category.name["ar"]
                : category.name;
            const catSlugEn =
              typeof category.slug === "object"
                ? category.slug["en"]
                : category.slug;
            return (
              <option
                key={category._id}
                value={catSlugEn ? catSlugEn.toLowerCase() : ""}
              >
                {catName}
              </option>
            );
          })}
        </select>

        <div className="mobile-quick-actions">
          <button className="mobile-quick-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
            </svg>
          </button>
          <button className="mobile-quick-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 6h18M7 12h10m-7 6h4" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default SecondNavbar;
