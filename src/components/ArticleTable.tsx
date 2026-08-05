import type { Article } from "@/components/ArticleDashboard";

interface ArticleTableProps {
  articleList: Article[];
  filterCategory: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function ArticleTable({ articleList, filterCategory, onEdit, onDelete }: ArticleTableProps) {
  const filtered = filterCategory === "all"
    ? articleList
    : articleList.filter(item => item.category === filterCategory);

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "16px" }}>
      <thead>
        <tr style={{ backgroundColor: "#f3f4f6" }}>
          <th style={{ border: "1px solid #e5e7eb", padding: "12px", textAlign: "left" }}>ID</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "12px", textAlign: "left" }}>Title</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "12px", textAlign: "left" }}>Category Slug</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "12px", textAlign: "left" }}>Publish Date</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "12px", textAlign: "left" }}>Page Views</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "12px", textAlign: "left" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filtered.length === 0 ? (
          <tr>
            <td colSpan={6} style={{ padding: "30px", textAlign: "center", color: "#666" }}>
              No articles found in this category
            </td>
          </tr>
        ) : (
          filtered.map((item) => (
            <tr key={item.id}>
              <td style={{ border: "1px solid #e5e7eb", padding: "12px" }}>{item.id}</td>
              <td style={{ border: "1px solid #e5e7eb", padding: "12px" }}>{item.title}</td>
              <td style={{ border: "1px solid #e5e7eb", padding: "12px" }}>{item.category}</td>
              <td style={{ border: "1px solid #e5e7eb", padding: "12px" }}>{item.publishDate}</td>
              <td style={{ border: "1px solid #e5e7eb", padding: "12px" }}>{item.views}</td>
              <td style={{ border: "1px solid #e5e7eb", padding: "12px" }}>
                <button
                  onClick={() => onEdit(item.id)}
                  style={{ color: "#2563eb", background: "transparent", border: "none", cursor: "pointer", marginRight: "14px" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  style={{ color: "#dc2626", background: "transparent", border: "none", cursor: "pointer" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}