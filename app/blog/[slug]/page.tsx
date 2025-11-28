// app/blog/[slug]/page.tsx
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageTracker } from "@/components/PageTracker";
import { TrackedLink } from "@/components/TrackedLink";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Suspense fallback={null}>
        <PageTracker pageUrl={`/blog/${slug}`} />
      </Suspense>
      
      <main className="min-h-screen flex flex-col items-center bg-white">
        <div className="flex-1 w-full flex flex-col items-center">
          {/* 네비게이션 */}
          <nav className="w-full flex justify-center border-b border-gray-200 h-16 bg-white sticky top-0 z-10">
            <div className="w-full max-w-4xl flex items-center px-6">
              <TrackedLink 
                href="/" 
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← 목록으로
              </TrackedLink>
            </div>
          </nav>

          {/* 글 본문 */}
          <article className="w-full max-w-4xl px-6 py-12">
            {/* 헤더 */}
            <header className="mb-12 border-b border-gray-200 pb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <time dateTime={post.date}>{post.date}</time>
                <span>·</span>
                <div className="flex gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </header>

            {/* MDX 컨텐츠 - prose 클래스로 스타일링 */}
            <div className="prose prose-lg prose-slate max-w-none
              prose-headings:font-bold prose-headings:text-gray-900
              prose-h1:text-3xl prose-h1:mb-4 prose-h1:mt-8
              prose-h2:text-2xl prose-h2:mb-3 prose-h2:mt-6
              prose-h3:text-xl prose-h3:mb-2 prose-h3:mt-4
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
              prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
              prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
              prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
              prose-li:text-gray-700 prose-li:mb-2
              prose-img:rounded-lg prose-img:shadow-lg
            ">
              <MDXRemote source={post.content} />
            </div>
          </article>
        </div>
      </main>
    </>
  );
}