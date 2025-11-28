// app/simple-sample/page.tsx

export default function SimpleSamplePage() {
  // 임시로 하드코딩된 데이터
  const posts = [
    {
      slug: "test-1",
      title: "테스트 글 1",
      date: "2025-01-15",
      excerpt: "첫 번째 테스트 글입니다",
      tags: ["test"]
    },
    {
      slug: "test-2", 
      title: "테스트 글 2",
      date: "2025-01-16",
      excerpt: "두 번째 테스트 글입니다",
      tags: ["test"]
    }
  ];

  return (
    <main style={{ minHeight: "100vh", padding: "40px" }}>
      <h1>블로그 목록</h1>
      <div>
        {posts.length === 0 ? (
          <p>글이 없습니다</p>
        ) : (
          posts.map((post) => (
            <div key={post.slug} style={{ marginTop: "20px", borderBottom: "1px solid #ddd", paddingBottom: "20px" }}>
              <h2>{post.title}</h2>
              <p>{post.date}</p>
              <p>{post.excerpt}</p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}