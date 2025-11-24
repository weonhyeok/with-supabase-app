// app/simple-sample/page.tsx

export default function SimpleSamplePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
      }}
    >
      <div>
        <h1>Simple Sample Page</h1>
        <p style={{ marginTop: "8px", fontSize: "14px" }}>
          이 페이지는 로그인, Supabase 전혀 안 쓰는 아주 심플한 테스트 페이지입니다.
        </p>
      </div>
    </main>
  );
}
