import type { Dispatch, SetStateAction } from "react";

interface CategoryFilterProps {
  selectedCategory: string;
  setSelectedCategory: Dispatch<SetStateAction<string>>;
}

export default function CategoryFilter({ selectedCategory, setSelectedCategory }: CategoryFilterProps) {
  const handleClick = (cat: string) => setSelectedCategory(cat);

  const categories = [
    { key: "all", label: "All Articles" },
    { key: "general-china-tech", label: "General China Tech" },
    { key: "semiconductor-hardware", label: "Semiconductor & Hardware" },
    { key: "ai-digital-software", label: "AI & Digital Software" },
    { key: "green-tech-manufacturing", label: "Green Tech & Advanced Manufacturing" },
  ];

  return (
    <div className="flex flex-wrap gap-3 my-5">
      {categories.map((item) => (
        <button
          key={item.key}
          onClick={() => handleClick(item.key)}
          className={`px-4 py-2 border rounded-lg transition-all
            ${selectedCategory === item.key
              ? "bg-gray-800 text-white border-gray-800"
              : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"}
          `}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}