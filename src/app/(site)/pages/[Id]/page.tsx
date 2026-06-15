"use client";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/redux/store";
import { Post } from "../../redux/features/postSlice";
import { useParams } from "next/navigation";
import Link from "next/link";

function getReadTime(content: string): string {
  const words = content.split(" ").length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export default function BlogPostDetail() {
  const posts = useSelector((state: RootState) => state.Post.posts);
  const params = useParams();
  const slug = params.Id as string;

  const post: Post | undefined = posts.find((p) => p.slug === slug);

  /* ── Not found ── */
  if (!post) {
    return (
      <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4">
        <p className="text-sky-400 font-mono text-xs uppercase tracking-widest mb-4">
          404
        </p>
        <h1 className="text-3xl font-bold text-slate-100 mb-3">
          Post not found
        </h1>
        <p className="text-slate-500 text-sm mb-8">
          This post may have been moved or deleted.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-mono text-sky-400 hover:text-sky-300 transition-colors"
        >
          ← Back to blog
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-300">

      {/* ── Top nav bar ── */}
      <nav className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur border-b border-slate-800/60 px-4 sm:px-6">
        <div className="mx-auto max-w-2xl h-12 flex items-center justify-between">
          <Link
            href="/post"
            className="flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-sky-400 transition-colors duration-200 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-200 inline-block">
              ←
            </span>
            All posts
          </Link>
          <span className="text-[11px] font-mono text-slate-600">
            {getReadTime(post.content)}
          </span>
        </div>
      </nav>

      {/* ── Hero / title block ── */}
      <header className="mx-auto max-w-2xl px-4 sm:px-6 pt-16 pb-10">
        {/* Glowing accent line */}
        <div className="w-10 h-[3px] rounded-full bg-sky-400 mb-8 shadow-[0_0_14px_3px_rgba(56,189,248,0.5)]" />

        <h1 className="font-mono text-3xl sm:text-4xl font-bold text-slate-50 leading-tight tracking-tight mb-6">
          {post.title}
        </h1>

        {/* Meta row */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[11px] font-mono text-sky-400/80 bg-sky-400/10 border border-sky-400/20 px-2.5 py-1 rounded-full">
            {getReadTime(post.content)}
          </span>
          {post.slug && (
            <span className="text-[11px] font-mono text-slate-600">
              /{post.slug}
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="mt-10 h-px bg-gradient-to-r from-sky-500/40 via-slate-700/60 to-transparent" />
      </header>

      {/* ── Body content ── */}
      <article className="mx-auto max-w-2xl px-4 sm:px-6 pb-24">
        <div className="prose-custom">
          {post.content.split("\n").map((paragraph, i) =>
            paragraph.trim() ? (
              <p
                key={i}
                className="text-slate-300 text-base sm:text-[17px] leading-8 mb-6 font-sans"
              >
                {paragraph}
              </p>
            ) : (
              <div key={i} className="mb-3" />
            )
          )}
        </div>

        {/* ── Footer nav ── */}
        <div className="mt-16 pt-8 border-t border-slate-800 flex items-center justify-between">
          <Link
            href="/page"
            className="group flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-sky-400 transition-colors duration-200"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-200 inline-block">
              ←
            </span>
            Back to all posts
          </Link>

          <button
            onClick={() => navigator.clipboard?.writeText(window.location.href)}
            className="text-xs font-mono text-slate-600 hover:text-sky-400 transition-colors duration-200"
          >
            Copy link
          </button>
        </div>
      </article>
    </main>
  );
}