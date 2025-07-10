import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useCategory } from "../../context/CategoryContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../components/RecommendationsSection/RecommendationsSection.css";
import Loading from "../../components/Loading/Loading";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const MAX_PRICE = 47000;
const MIN_PRICE = 0;
const BRANDS_TO_SHOW = 5;

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const categorySlug = (params.get("category") || "all").toLowerCase();
  const { setSelectedCategory } = useCategory();
  const { t, i18n } = useTranslation();
  const language = i18n.language === "ar" ? "ar" : "en";

  // --- فلترة ---
  const [selectedBrands, setSelectedBrands] = React.useState([]);
  const [priceRange, setPriceRange] = React.useState([0, 35000]);
  const [rating, setRating] = React.useState(0);
  const [brands, setBrands] = React.useState([]);

  // بناء رابط الفلترة
  const buildApiUrl = () => {
    let url = `http://127.0.0.1:3000/api/product?categorySlug=${categorySlug}`;
    if (selectedBrands.length > 0) {
      url += `&brandSlug=${selectedBrands.join(",")}`;
    }
    if (priceRange[0] > MIN_PRICE) url += `&basePrice[gte]=${priceRange[0]}`;
    if (priceRange[1] < MAX_PRICE) url += `&basePrice[lte]=${priceRange[1]}`;
    if (rating > 0) url += `&averageRating[gte]=${rating}`;
    return url;
  };

  // جلب المنتجات حسب الفلاتر
  const fetchProducts = async () => {
    const res = await fetch(buildApiUrl());
    const data = await res.json();
    return data.data;
  };

  // جلب المنتجات
  const { data: products, isLoading } = useQuery({
    queryKey: ["products", categorySlug, selectedBrands, priceRange, rating],
    queryFn: fetchProducts,
    keepPreviousData: true,
  });

  // جلب العلامات التجارية من API
  React.useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch("http://127.0.0.1:3000/api/brand");
        const data = await res.json();
        setBrands(data.data.brands || []);
      } catch {
        setBrands([]);
      }
    };
    fetchBrands();
  }, []);

  React.useEffect(() => {
    setSelectedCategory(categorySlug);
  }, [categorySlug, setSelectedCategory]);

  // تحديث الفلاتر من الـ URL عند التحميل الأولي
  React.useEffect(() => {
    // Brands
    const brandsParam = params.get("brands") || params.get("Brands");
    if (brandsParam) {
      setSelectedBrands(brandsParam.split(","));
    } else {
      setSelectedBrands([]);
    }
    // Price
    const minPrice = params.get("minPrice");
    const maxPrice = params.get("maxPrice");
    if (minPrice || maxPrice) {
      setPriceRange([
        minPrice ? Number(minPrice) : 0,
        maxPrice ? Number(maxPrice) : 35000,
      ]);
    } else {
      setPriceRange([0, 35000]);
    }
    // Rating
    const ratingParam = params.get("rating");
    if (ratingParam) {
      setRating(Number(ratingParam));
    } else {
      setRating(0);
    }
    // eslint-disable-next-line
  }, [location.search]);

  // تحديث الـ URL عند تغيير الفلاتر
  React.useEffect(() => {
    const urlParams = new URLSearchParams();
    urlParams.set("category", categorySlug);
    if (selectedBrands.length > 0) {
      urlParams.set("brands", selectedBrands.join(","));
    }
    if (priceRange[0] > MIN_PRICE) urlParams.set("minPrice", priceRange[0]);
    if (priceRange[1] < MAX_PRICE) urlParams.set("maxPrice", priceRange[1]);
    if (rating > 0) urlParams.set("rating", rating);
    const newUrl = `/products?${urlParams.toString()}`;
    if (location.pathname + location.search !== newUrl) {
      navigate(newUrl, { replace: true });
    }
    // eslint-disable-next-line
  }, [selectedBrands, priceRange, rating, categorySlug]);

  // --- واجهة الفلاتر ---
  const [showAllBrands, setShowAllBrands] = React.useState(false);
  const brandsToDisplay = showAllBrands
    ? brands
    : brands.slice(0, BRANDS_TO_SHOW);
  return (
    <div className="flex gap-8">
      {/* الشريط الجانبي للفلاتر */}
      <aside
        className="sticky top-8 self-start min-w-[260px] max-h-[calc(100vh-40px)] h-[calc(100vh-40px)] flex flex-col shadow-xl z-10 overflow-y-auto border-none gap-8 py-10 px-4"
        style={{ background: "var(--card-bg)", color: "var(--text)" }}
      >
        {/* العلامة التجارية */}
        <div
          className="mb-8 rounded-lg shadow-sm flex flex-col"
          style={{
            background: "var(--card-bg)",
            color: "var(--text)",
            border: "1px solid var(--border-color)",
            padding: "2rem",
          }}
        >
          <h3
            className="text-xl font-extrabold mb-4 border-b pb-2"
            style={{ borderColor: "var(--border-color)" }}
          >
            {language === "ar" ? "العلامات التجارية" : "Brands"}
          </h3>
          {brandsToDisplay.map((brand) => (
            <div key={brand.slug} className="mb-3 flex items-center">
              <label className="flex items-center cursor-pointer w-full text-lg gap-3">
                <input
                  type="checkbox"
                  value={brand.slug}
                  checked={selectedBrands.includes(brand.slug)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedBrands((prev) =>
                        Array.from(new Set([...prev, brand.slug]))
                      );
                    } else {
                      setSelectedBrands((prev) =>
                        prev.filter((slug) => slug !== brand.slug)
                      );
                    }
                  }}
                  className="accent-blue-600 w-6 h-6 mr-2 border-2 border-gray-400 rounded"
                />
                {brand.logoUrl && (
                  <img
                    src={brand.logoUrl}
                    alt={brand.slug}
                    className="w-8 h-8 object-contain rounded bg-white mr-2 border"
                  />
                )}
                <span className="text-lg font-medium">
                  {typeof brand.name === "object"
                    ? brand.name[language] ||
                      brand.name["en"] ||
                      brand.name["ar"] ||
                      ""
                    : brand.name || ""}
                </span>
              </label>
            </div>
          ))}
          {brands.length > BRANDS_TO_SHOW && (
            <button
              onClick={() => setShowAllBrands((prev) => !prev)}
              className="text-sm text-blue-600 hover:underline mt-2 font-semibold"
              style={{ color: "var(--primary-blue)" }}
            >
              {showAllBrands
                ? language === "ar"
                  ? "عرض أقل"
                  : "Show Less"
                : language === "ar"
                ? "عرض المزيد"
                : "Show More"}
            </button>
          )}
          <div>
            <button
              onClick={() => setSelectedBrands([])}
              className="mt-3 text-sm font-semibold px-4 py-2 rounded-full border border-blue-500 bg-blue-50 text-blue-700 transition-colors duration-200 hover:bg-blue-500 hover:text-white shadow-sm"
            >
              {language === "ar" ? "عرض المزيد" : "Show More"}
            </button>
          </div>
        </div>
        {/* السعر (شريط مزدوج) */}
        <div
          className="mb-8 rounded-lg shadow-sm flex flex-col"
          style={{
            background: "var(--card-bg)",
            color: "var(--text)",
            border: "1px solid var(--border-color)",
            padding: "2rem",
          }}
        >
          <h3
            className="text-xl font-extrabold mb-4 border-b pb-2"
            style={{ borderColor: "var(--border-color)" }}
          >
            {t("cart.price")}
          </h3>
          <div
            className="mb-4 text-base font-bold"
            style={{ color: "var(--text)" }}
          >
            {t("common.currency")} {priceRange[0]} – {t("common.currency")}{" "}
            {priceRange[1]}
          </div>
          <div className="px-2 py-4">
            <Slider
              range
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={100}
              value={priceRange}
              onChange={(values) =>
                setPriceRange([
                  Math.min(values[0], values[1]),
                  Math.max(values[0], values[1]),
                ])
              }
              trackStyle={[
                { backgroundColor: "var(--primary-blue)", height: 8 },
              ]}
              handleStyle={[
                {
                  borderColor: "var(--primary-blue)",
                  height: 24,
                  width: 24,
                  marginTop: -8,
                  backgroundColor: "#fff",
                },
                {
                  borderColor: "var(--primary-blue)",
                  height: 24,
                  width: 24,
                  marginTop: -8,
                  backgroundColor: "#fff",
                },
              ]}
              railStyle={{ backgroundColor: "#cbd5e1", height: 8 }}
            />
          </div>
        </div>
        {/* التقييم */}
        <div
          className="mb-8 rounded-lg shadow-sm flex flex-col"
          style={{
            background: "var(--card-bg)",
            color: "var(--text)",
            border: "1px solid var(--border-color)",
            padding: "2rem",
          }}
        >
          <h3
            className="text-xl font-extrabold mb-4 border-b pb-2"
            style={{ borderColor: "var(--border-color)" }}
          >
            {language === "ar" ? "التقييم" : "Rating"}
          </h3>
          <input
            type="range"
            min={0}
            max={5}
            step={0.5}
            value={rating}
            onChange={(e) => setRating(+e.target.value)}
            className="w-full h-3 rounded-lg accent-blue-600 bg-blue-500"
            style={{ accentColor: "var(--primary-blue)" }}
          />
          <div
            className="text-base mt-2 font-semibold"
            style={{ color: "var(--text)" }}
          >
            {rating}+
          </div>
        </div>
      </aside>
      {/* المنتجات */}
      <div style={{ flex: 1 }}>
        <div className="recommendations-section">
          {isLoading ? (
            <Loading />
          ) : (
            <div className="grid gap-6 p-6 w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {products?.map((product) => {
                const featuredImage =
                  product.images?.find((img) => img.isFeatured) ||
                  product.images?.[0];
                const imageUrl =
                  featuredImage?.url ||
                  "https://dummyimage.com/300x200/eee/333&text=No+Image";
                const imageAlt =
                  typeof featuredImage?.altText === "object"
                    ? featuredImage.altText[language] ||
                      featuredImage.altText["en"] ||
                      featuredImage.altText["ar"] ||
                      ""
                    : featuredImage?.altText || "";
                const brandName =
                  typeof product.brand?.name === "object"
                    ? product.brand.name[language] ||
                      product.brand.name["en"] ||
                      product.brand.name["ar"] ||
                      ""
                    : product.brand?.name || "";
                const price = product.basePrice || product.price || 0;
                const discount =
                  product.discount || product.discountPercentage || 0;
                const priceAfterDiscount =
                  product.bestPriceAfterDiscount || price;
                const oldPrice = discount > 0 ? price : null;
                const categoryName =
                  typeof product.category?.name === "object"
                    ? product.category.name[language] ||
                      product.category.name["en"] ||
                      product.category.name["ar"] ||
                      ""
                    : product.category?.name || "";
                return (
                  <div
                    key={product._id}
                    className="recommendation-card"
                    style={{ position: "relative", cursor: "pointer" }}
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    {/* شارة التصنيف */}
                    <span
                      style={{
                        position: "absolute",
                        top: "16px",
                        left: "16px",
                        background: "#2563eb",
                        color: "#fff",
                        borderRadius: "20px",
                        padding: "4px 18px",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        boxShadow: "0 2px 8px rgba(37,99,235,0.10)",
                        zIndex: 2,
                      }}
                    >
                      {categoryName}
                    </span>
                    <div className="recommendation-image-wrapper">
                      <img
                        src={imageUrl}
                        alt={imageAlt}
                        className="recommendation-image"
                      />
                      {discount > 0 && (
                        <span className="discount-badge">-{discount}%</span>
                      )}
                    </div>
                    <div className="recommendation-info">
                      <div className="brand-row">
                        <span className="recommendation-brand">
                          {brandName}
                        </span>
                      </div>
                      <span className="recommendation-title">
                        {typeof product.name === "object"
                          ? product.name[language] ||
                            product.name["en"] ||
                            product.name["ar"] ||
                            ""
                          : product.name || ""}
                      </span>
                    </div>
                    <div className="price-row">
                      <span className="recommendation-price">
                        {priceAfterDiscount} {t("common.currency")}
                      </span>
                      {oldPrice && (
                        <span className="recommendation-price old">
                          {oldPrice} {t("common.currency")}
                        </span>
                      )}
                    </div>
                    <button
                      className="add-to-cart-btn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t("cart.addToCart")}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
