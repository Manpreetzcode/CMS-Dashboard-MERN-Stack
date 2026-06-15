"use client";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/redux/store";
import { Post } from "../redux/features/postSlice";
import Link from "next/link";

function getReadTime(content: string): string {
  const words = content.split(" ").length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function getExcerpt(content: string, wordCount = 20): string {
  return content.split(" ").slice(0, wordCount).join(" ") + "…";
}

export default function BlogPosts() {
  const posts = useSelector((state: RootState) => state.Post.posts);
  
const filteredPosts: Post[] = posts.filter(
          (post) => ["Post"].includes(post.postType)
        );

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mx-auto max-w-2xl mb-14">
        <p className="text-sky-400 text-xs font-mono uppercase tracking-widest mb-3">
          Latest Posts
        </p>
        <h1 className="text-4xl font-bold text-slate-50 tracking-tight">
          The Post
        </h1>
        <div className="mt-4 h-px bg-gradient-to-r from-sky-500/60 via-slate-700 to-transparent" />
      </div>

      {/* Post list */}
      <ul className="mx-auto max-w-2xl space-y-4">
        {filteredPosts.length === 0 ? (
          <li className="text-slate-500 font-mono text-sm text-center py-16">
            No Page yet — check back soon.
          </li>
        ) : (
          filteredPosts.map((post) => (
            <li key={post._id}>
              <article
                className="
                  group relative
                  bg-slate-900 rounded-lg
                  border border-slate-800
                  pl-5 pr-6 py-6
                  cursor-pointer
                  transition-all duration-300
                  hover:border-slate-700
                  hover:bg-slate-800/60
                  /* Glowing left-border signature element */
                  before:absolute before:inset-y-0 before:left-0
                  before:w-[3px] before:rounded-l-lg
                  before:bg-sky-500/30
                  before:transition-all before:duration-300
                  hover:before:bg-sky-400
                  hover:before:shadow-[0_0_12px_2px_rgba(56,189,248,0.45)]
                "
              >
                {/* Read time badge */}
                <span className="inline-block mb-3 text-[11px] font-mono text-slate-500 bg-slate-800 group-hover:bg-slate-700 px-2 py-0.5 rounded transition-colors duration-200">
                  {getReadTime(post.content)}
                </span>

                {/* Title */}
                <h2 className="font-mono text-lg font-semibold text-slate-100 group-hover:text-sky-300 transition-colors duration-200 leading-snug mb-2">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-slate-400 text-sm leading-relaxed">
                  {getExcerpt(post.content)}
                </p>

                {/* Read more */}
                <Link href={"/post/"+post.slug} className="mt-4 text-xs font-mono text-sky-500/70 group-hover:text-sky-400 transition-colors duration-200 flex items-center gap-1.5">
                  Read more
                  <span className="translate-x-0 group-hover:translate-x-1 transition-transform duration-200 inline-block">
                    →
                  </span>
                </Link>
              </article>
            </li>
          ))
        )}
      </ul>
    </main>
  );
}
