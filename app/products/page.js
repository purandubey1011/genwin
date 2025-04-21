"use client";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { PhoneIcon } from "@heroicons/react/24/outline";
import { Platypi } from 'next/font/google';
import PhoneProductBlack from "@/components/PhoneProductBlack";
import Phoneproduct from "@/components/Phoneproduct";
import SearchIcon from "@/components/SearchIcon";
import FilterIconPhone from "@/components/FilterIconPhone";
import CancelIcon from "@/components/CancelIcon";
import FilterSidebar from "@/components/FilterSidebar"; 
const platypi = Platypi({
  weight: ['400','500','600'],
  preload: false,
});

const placeholderImg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZDBkMGQwIiAvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM4MDgwODAiPlBpeGVsbHM8L3RleHQ+Cjwvc3ZnPg==';

export default function ProductsPage1() {
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
      categories: [], subcategories: [], industries: [], brands: [],
  });
  const [visibleProductsCount, setVisibleProductsCount] = useState(9);
  const [showMobileNumberMap, setShowMobileNumberMap] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  console.log(selectedProduct)

  useEffect(() => {
      async function fetchCategories() {
        try {
            const response = await fetch("/api/admin/getcategories");
            if (!response.ok) throw new Error("Failed to fetch categories");
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setCategories([]);
        }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/admin/getallproducts", {
          method: "GET", headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error(`Failed to fetch products: ${response.statusText}`);
        const data = await response.json();
        setAllProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setAllProducts([]);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 1024);
        if (window.innerWidth >= 1024) setIsExpanded(true);
        else setIsExpanded(false);
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const handleFilterChange = (newFilters) => {
      setActiveFilters(newFilters);
      setVisibleProductsCount(9);
  };

  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const searchLower = searchText.toLowerCase();
      const matchesSearch = !searchText ||
          product.productName?.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      const matchesSubcategory = activeFilters.subcategories.length === 0 ||
 
          (product.subCategoryName && activeFilters.subcategories.includes(product.subCategoryName));

      if (!matchesSubcategory) return false;



      return true;
    });
  }, [allProducts, searchText, activeFilters]);


  const loadMoreProducts = () => {
    setVisibleProductsCount((prev) => prev + 9);
  };

  const handleOpenContactModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleViewMobileClick = (productId) => {
    setShowMobileNumberMap(prev => ({
        ...prev,
        [productId]: !prev[productId] 
    }));
  };

  const popImageSrc = useMemo(() => {
    let images = [];
    try {
        images = selectedProduct.images;
        return images?.[0]?.data

    } catch (error) {
        console.error("Error parsing imagesurl:", error);
    }
    const imageSrc = images?.[0]?.data ?? null;
  }, [isModalOpen, selectedProduct]);


  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-6">

        <FilterSidebar
            categories={categories}
            onFilterChange={handleFilterChange}
        />

        <main className="w-full lg:w-4/5 space-y-4">

         <div className="flex justify-between items-center flex-wrap gap-4">
            <h1 className={`text-2xl lg:text-3xl font-[600] text-gray-800 ${platypi.className}`}>
              All <span className="text-primary">Products</span>
            </h1>
            <div className="relative flex-grow sm:flex-grow-0">
                 <input
                    type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)}
                    className="border border-gray-300 rounded-lg py-2 pl-10 pr-4 outline-none focus:ring-1 focus:ring-primary focus:border-primary w-full sm:w-64"
                    placeholder="Search products..."
                />
                 <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"><SearchIcon /></span>
            </div>
          </div>

          <div className="text-right text-sm lg:text-base text-gray-600 font-medium">
            Showing {Math.min(visibleProductsCount, filteredProducts.length)} of {filteredProducts.length} Products
          </div>

           {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.slice(0, visibleProductsCount).map((product) => {
                        let images = [];
                            try {
                                images = product.images;
                            } catch (error) {
                                console.error("Error parsing imagesurl:", error);
                            }
                            const imageSrc = images?.[0]?.data ?? null;

                        const specifications = product.specifications || {};

                        return (
                        <div key={product._id} className="bg-f7f4ed rounded-md border border-E6ECF6 hover:border-red-200 transition-colors duration-300 group flex flex-col">
                            <div className="cursor-pointer flex-grow" onClick={() => handleOpenContactModal(product)}>
                                <div className="overflow-hidden rounded-t-md aspect-square bg-gray-100"> 
                                    <Image
                                        src={imageSrc || placeholderImg}
                                        alt={product.productName || 'Product Image'}
                                        className={`object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-in-out ${!imageSrc ? 'opacity-50' : ''}`} 
                                        width={400}
                                        height={400}
                                        priority={false}
                                    />
                                </div>
                                <div className="p-4 flex-grow">
                                    <h3 className="group-hover:text-primary text-[#393939] text-base font-[600] mb-2 line-clamp-2 h-12" title={product.productName}>
                                        {product.productName}
                                    </h3>
                                    <ul className="grid grid-cols-2 gap-2 mb-3">
                                        {Object.entries(specifications).slice(0, 4).map(([key, value], index) => (
                                            <li key={key} className={index % 2 !== 0 ? 'text-right' : ''}>
                                                <p className="text-[#09090999] text-xs font-[500] truncate">{key}</p>
                                                <p className="text-[#393939] text-sm font-[500] truncate">{String(value)}</p>
                                            </li>
                                        ))}
                                    </ul>
                                    <div>
                                        <p className="text-[#09090999] text-xs font-[500]">Price</p>
                                        <h5>
                                            <span className="font-[600] text-lg group-hover:text-primary transition-colors duration-300">₹{product.price}</span>
                                            <span className="pl-1 text-sm text-[#09090966]">Per Piece</span>
                                        </h5>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t border-gray-200 mt-auto space-y-2">
                                {!showMobileNumberMap[product._id] ? ( 
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewMobileClick(product._id);
                                        }}
                                        className="w-full border border-gray-300 text-gray-700 text-sm font-[500] flex items-center justify-center py-2 px-4 rounded-md group-hover:bg-red-50 group-hover:border-red-200 group-hover:text-primary transition-colors duration-300"
                                    >
                                        <span className={`h-5 w-5 mr-2`}>
                                            <span className="hidden group-hover:inline"><Phoneproduct /></span>
                                            <span className="inline group-hover:hidden"><PhoneProductBlack /></span>
                                        </span>
                                        View Mobile Number
                                    </button>
                                ) : (
                                    <div className="w-full bg-gray-100 border border-gray-300 flex items-center justify-center py-2 px-4 rounded-md text-gray-800 text-sm font-medium">
                                        <PhoneIcon className="h-5 w-5 mr-2 text-green-600" />
                                        {product.mobile} 
                                    </div>
                                )}
                                <button
                                    onClick={() => handleOpenContactModal(product)}
                                    className="w-full bg-[#181818] border border-[#181818] text-sm font-[500] text-white flex items-center justify-center py-2 px-4 rounded-md group-hover:bg-primary transition-colors duration-300"
                                >
                                    Get Best Price
                                </button>
                            </div>
                        </div>
                        );
                    })}
                </div>
            ) : (
                 <div className="text-center py-10 text-gray-500">
                    No products found matching your criteria.
                 </div>
            )}

          {filteredProducts.length > visibleProductsCount && (
            <div className="text-center pt-8">
              <button
                onClick={loadMoreProducts}
                className="text-primary px-6 py-2 rounded-full border border-[#FFD2D2] bg-[#e52d3814] hover:bg-[#e52d382e] transition duration-300 text-base font-[600]"
              >
                Show More
              </button>
            </div>
          )}
        </main>

        {isModalOpen && selectedProduct && ( 
             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                 <div className="w-full max-w-4xl bg-white rounded-2xl flex flex-col md:flex-row overflow-hidden shadow-xl max-h-[90vh]">
                    <div className="w-full md:w-2/5 bg-[#FFF0F0] flex flex-col p-6 border-r border-gray-200">
                        <div className="bg-white flex items-center justify-center rounded-lg border border-gray-200 mb-4 aspect-square overflow-hidden">
                            {popImageSrc ? (
                                <Image
                                    src={popImageSrc} // Use pre-calculated popImageSrc
                                    alt={selectedProduct.productName || 'Product Image'}
                                    width={300} height={300}
                                    className="object-contain h-full w-auto"
                                />
                             ) : (
                                 <div className="h-full w-full flex items-center justify-center text-gray-400">No Image</div>
                             )}
                         </div>
                         {/* ... Rest of left side info ... */}
                          <div className="space-y-3 flex flex-col text-sm">
                             <h3 className="text-[#181818] text-lg font-[600]">{selectedProduct.productName}</h3>
                             <div>
                                 <p className="text-[#09090999] text-xs font-[500]">Price</p>
                                 <h5>
                                     <span className="font-[600] text-xl text-gray-800">₹{selectedProduct.price}</span>
                                     <span className="pl-1 text-sm text-[#09090966]">Per Piece</span>
                                 </h5>
                             </div>
                             <div>
                                 <p className="text-[#09090999] text-xs font-[500]">Sold By:</p>
                                 <span className="text-sm text-[#181818] font-medium">Genwin (Example Seller)</span>
                             </div>
                         </div>
                    </div>
                    <div className="w-full md:w-3/5 flex flex-col bg-white overflow-y-auto">
                        <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-4">
                            <div className="flex justify-between items-center">
                                <h3 className={`text-base md:text-lg font-[500] text-gray-800 ${platypi.className}`}>
                                    <span className="text-primary">Contact Seller</span> for {selectedProduct.productName}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700"><CancelIcon /></button>
                            </div>
                        </div>
                        <div className="p-6 flex flex-col space-y-4 text-sm">
                            <div>
                                <label className="font-medium text-gray-700 block mb-1">Quantity</label>
                                <input type="number" placeholder="Enter Quantity" className="w-full p-2 border rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none" min="1"/>
                             </div>
                             <div>
                                <label className="font-medium text-gray-700 block mb-1">Requirement Details</label>
                                <textarea placeholder="Enter any specific details..." rows="3" className="w-full p-2 border rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"></textarea>
                             </div>
                              <div>
                                <label className="font-medium text-gray-700 block mb-1">GST Number (Optional)</label>
                                <input type="text" placeholder="Enter GST Number" className="w-full p-2 border rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"/>
                              </div>
                            <div className="pt-2">
                                <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-red-700 transition duration-200"
                                    onClick={() => { console.log("Submit contact form"); setIsModalOpen(false); }}>
                                    Submit Inquiry
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
         )}
      </div>
    </div>
  );
}