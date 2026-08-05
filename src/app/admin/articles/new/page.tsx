"use client";

import { useRouter } from "next/navigation";
import ArticleForm from "@/components/ArticleForm";

export default function NewArticlePage() {
  const router = useRouter();
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Article</h1>
        <button onClick={() => router.back()} className="text-sm text-gray-600 hover:text-black">← Back</button>
      </div>
      <ArticleForm mode="create" />
    </div>
  );
}
