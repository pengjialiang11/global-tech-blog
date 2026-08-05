"use client";
import { useState } from "react";
import ArticleFilterWrapper from "./ArticleFilterWrapper";
import ArticleTable from "./ArticleTable";

export type Article = {
  id: number;
  title: string;
  category: string;
  publishDate: string;
  views: number;
};

export default function ArticleDashboard() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // 模拟文章数据
  const articleList: Article[] = [
    {
      id: 1,
      title: "Latest Breakthroughs in Domestic Chips",
      category: "semiconductor-hardware",
      publishDate: "2026-07-20",
      views: 1289,
    },
    {
      id: 2,
      title: "Large Model Industry Implementation Analysis",
      category: "ai-digital-software",
      publishDate: "2026-07-25",
      views: 2451,
    },
    {
      id: 3,
      title: "Overseas Export Report of New Energy Equipment",
      category: "green-tech-manufacturing",
      publishDate: "2026-07-28",
      views: 986,
    },
    {
      id: 4,
      title: "Macroeconomic Review of China's Tech Industry",
      category: "general-china-tech",
      publishDate: "2026-08-01",
      views: 3620,
    },
  ];

  const handleEdit = (id: number) => {
    console.log("Edit article ID:", id);
  };

  const handleDelete = (id: number) => {
    console.log("Delete article ID:", id);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "12px" }}>
        SinoTechLens Admin Dashboard
      </h1>
      <p style={{ marginBottom: "24px" }}>SinoTechLens Content Management System</p>

      <ArticleFilterWrapper
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <h2 style={{ fontSize: "20px", marginTop: "32px", marginBottom: "16px" }}>Article List</h2>
      <ArticleTable
        articleList={articleList}
        filterCategory={selectedCategory}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}