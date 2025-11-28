// app/simple-list/page.tsx
import { getAllPosts } from "@/lib/posts";
import Link from "next/link";
import { Suspense } from "react";
import { PageTracker } from "@/components/PageTracker";

export default function SimpleSamplePage() {
  const posts = getAllPosts();

  return (
    <>
      <Suspense fallback={null}>
        <PageTracker pageUrl="/simple-list" />
      </Suspense>
      
      <main style={{ minHeight: "100vh", padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "32px", marginBottom: "40px" }}>블로그 목록</h1>
        
        {posts.length === 0 ? (
          <p>아직 글이 없습니다.</p>
        ) : (
          <div>
            {posts.map((post) => (
              <div 
                key={post.slug} 
                style={{ 
                  marginBottom: "30px", 
                  borderBottom: "1px solid #ddd", 
                  paddingBottom: "20px" 
                }}
              >
                <Link 
                  href={`/blog/${post.slug}`}
                  style={{ 
                    fontSize: "24px", 
                    fontWeight: "bold",
                    textDecoration: "none",
                    color: "#0070f3"
                  }}
                >
                  {post.title}
                </Link>
                <p style={{ color: "#666", fontSize: "14px", marginTop: "8px" }}>
                  {post.date}
                </p>
                <p style={{ marginTop: "12px" }}>
                  {post.excerpt}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}