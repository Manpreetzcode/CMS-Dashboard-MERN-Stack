"use client";

import { useState } from "react";
import "./post.css"

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/redux/store";
import { Post } from "@/app/redux/features/postSlice";

import Link from "next/link";
import type { AppDispatch } from "@/app/redux/store";

import { deletePost, fetchPosts, updatePost } from "@/app/redux/features/postSlice";

type SortKey = "title" | "date";
type SortDir = "asc" | "desc";

export default function PostsTable({ mode = "Post" }: { mode?: "Post" | "Page"; }) {

  const postStore = useSelector((state: RootState) => state.Post);
  const posts: Post[] = postStore.posts ?? [];

  const [selected, setSelected] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [search, setSearch] = useState("");
  const [bulkAction, setBulkAction] = useState("bulk");
  const [dateFilter, setDateFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Filter by type, then by search query
  const filteredPosts: Post[] = posts
    .filter((post) => [mode as string].includes(post.postType))
    .filter((post) =>
      search.trim() === ""
        ? true
        : post.title.toLowerCase().includes(search.trim().toLowerCase())
    );

  const allSelected =
    filteredPosts.length > 0 && selected.length === filteredPosts.length;

  const toggleAll = () =>
    setSelected(allSelected ? [] : filteredPosts.map((p) => p._id as string));

  const toggleOne = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = async (postID: string) => {
    if (!postID) return;
    await dispatch(deletePost(postID));
    await dispatch(fetchPosts());
  };

  // Bulk action handler
  const handleBulkApply = async () => {
    if (bulkAction === "bulk" || selected.length === 0) return;

    setBulkLoading(true);
    try {
      if (bulkAction === "delete") {
        // Delete all selected posts sequentially
        for (const id of selected) {
          await dispatch(deletePost(String(id)));
        }
        await dispatch(fetchPosts());
        setSelected([]);
      } else if (bulkAction === "draft") {
        // Move selected posts to draft
        for (const id of selected) {
        const post = posts.find((p) => p._id === id);

        if (post) {
          await dispatch(
            updatePost({
              ...post,
              status: "Draft",
              postId: post._id as string
            })
          );

          console.log("run");
        }
      }

      await dispatch(fetchPosts());
        setSelected([]);
      }
    } finally {
      setBulkLoading(false);
      setBulkAction("bulk");
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => (
    <span className="inline-flex flex-col ml-1 leading-none">
      <span
        className="text-[8px] leading-none"
        style={{
          color:
            sortKey === col && sortDir === "asc"
              ? "var(--primarycolor)"
              : "#999",
        }}
      >
        ▲
      </span>
      <span
        className="text-[8px] leading-none"
        style={{
          color:
            sortKey === col && sortDir === "desc"
              ? "var(--primarycolor)"
              : "#999",
        }}
      >
        ▼
      </span>
    </span>
  );

  const BulkControls = () => (
    <div className="flex items-center gap-2">
      <select
        className="wp-select"
        value={bulkAction}
        onChange={(e) => setBulkAction(e.target.value)}
        disabled={bulkLoading}
      >
        <option value="bulk">Bulk actions</option>
        <option value="delete">Delete Permanently</option>
        <option value="draft">Move to Draft</option>
      </select>
      <button
        className="wp-btn"
        onClick={handleBulkApply}
        disabled={bulkLoading || bulkAction === "bulk" || selected.length === 0}
        title={
          selected.length === 0
            ? "Select at least one post"
            : bulkAction === "bulk"
            ? "Choose an action"
            : `Apply to ${selected.length} post${selected.length > 1 ? "s" : ""}`
        }
        style={{
          opacity:
            bulkLoading || bulkAction === "bulk" || selected.length === 0
              ? 0.5
              : 1,
          cursor:
            bulkLoading || bulkAction === "bulk" || selected.length === 0
              ? "not-allowed"
              : "pointer",
        }}
      >
        {bulkLoading ? "Applying…" : "Apply"}
      </button>

      {selected.length > 0 && (
        <span className="text-[12px] text-gray-500">
          {selected.length} selected
        </span>
      )}
    </div>
  );

  return (
    <section>

      {/* Page Header */}
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-[23px] font-normal" style={{ color: "#1d2327" }}>
          Posts
        </h1>
        <Link href={"/dashboard/" + mode.toLowerCase() + "/add-" + mode.toLowerCase() } className="wp-btn-primary">
          Add Page
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-3 text-[13px]">
        <span className="tab-active">All ({filteredPosts.length})</span>
        <span className="mx-1 text-gray-400">|</span>
        <a href="#" className="tab-link">
          Published ({filteredPosts.length})
        </a>
      </div>

      {/* Filters Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BulkControls />
        </div>

        {/* Search — now actually filters the table */}
        <div className="flex items-center gap-2">
          <input
            type="search"
            className="wp-search"
            placeholder="Search pages…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {/* No separate button needed — filters live as you type */}
        </div>
      </div>

      {/* Items count */}
      <div className="flex justify-end mb-1">
        <span className="text-[13px] text-gray-600">
          {filteredPosts.length} item{filteredPosts.length !== 1 ? "s" : ""}
          {search.trim() !== "" && (
            <> &mdash; filtered by &ldquo;{search.trim()}&rdquo; &nbsp;
              <button
                className="action-link"
                style={{ fontSize: 12 }}
                onClick={() => setSearch("")}
              >
                Clear
              </button>
            </>
          )}
        </span>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table
          className="w-full border-collapse bg-white"
          style={{ boxShadow: "0 1px 1px rgba(0,0,0,.04)", border: "1px solid #c3c4c7" }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid #c3c4c7" }}>
              <th className="py-2 px-3 w-8">
                <input
                  type="checkbox"
                  className="wp-checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                />
              </th>
              <th
                className="py-2 px-3 text-left text-[13px] font-semibold sortable"
                style={{ color: "#1d2327" }}
                onClick={() => handleSort("title")}
              >
                Title <SortIcon col="title" />
              </th>
              <th
                className="py-2 px-3 text-left text-[13px] font-semibold"
                style={{ color: "#1d2327", minWidth: 80 }}
              >
                Author
              </th>
              <th
                className="py-2 px-3 text-left text-[13px] font-semibold sortable"
                style={{ color: "var(--secondarycolor)", minWidth: 140 }}
                onClick={() => handleSort("date")}
              >
                Date <SortIcon col="date" />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-8 px-3 text-center text-[13px] text-gray-500"
                >
                  {search.trim() !== ""
                    ? `No pages found for "${search.trim()}"`
                    : "No pages found."}
                </td>
              </tr>
            ) : (
              filteredPosts.map((post) => (
                <tr
                  key={post._id}
                  className={hoveredRow === Number(post._id) ? "row-hover" : ""}
                  style={{ borderBottom: "1px solid #c3c4c7" }}
                  onMouseEnter={() => setHoveredRow(Number(post._id))}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="py-2 px-3">
                    <input
                      type="checkbox"
                      className="wp-checkbox"
                      checked={selected.includes(post._id as string)}
                      onChange={() => toggleOne(post._id as string)}
                    />
                  </td>
                  <td className="py-2 px-3">
                    <a href="#" className="post-title-link">
                      {post.title}
                    </a>
                    <div className="row-actions flex items-center gap-1 mt-0.5">
                      <Link
                        href={"/dashboard/" + mode.toLowerCase() + "/update/" + post._id}
                        className="action-link"
                      >
                        Edit
                      </Link>
                      <span className="text-gray-400 text-xs">|</span>
                      <button
                        onClick={() => handleDelete(post._id as string)}
                        className="delete-link"
                      >
                        Delete Permanently
                      </button>
                      <span className="text-gray-400 text-xs">|</span>
                      <Link href={"/" + mode.toLowerCase() +  "/" + post.slug} className="action-link">
                        View
                      </Link>
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <a href="#" className="author-link">
                      Manpreet Singh
                    </a>
                  </td>
                  <td className="py-2 px-3">
                    <span
                      className="text-[13px] font-medium"
                      style={{ color: "#1d2327" }}
                    >
                      {post.status}
                    </span>
                    <br />
                    <span className="text-[12px] text-gray-500">
                      {post.publishDate}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: "1px solid #c3c4c7" }}>
              <th className="py-2 px-3 w-8">
                <input
                  type="checkbox"
                  className="wp-checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                />
              </th>
              <th
                className="py-2 px-3 text-left text-[13px] font-semibold"
                style={{ color: "#1d2327" }}
              >
                Title <SortIcon col="title" />
              </th>
              <th
                className="py-2 px-3 text-left text-[13px] font-semibold"
                style={{ color: "#1d2327" }}
              >
                Author
              </th>
              <th
                className="py-2 px-3 text-left text-[13px] font-semibold"
                style={{ color: "var(--secondarycolor)" }}
              >
                Date <SortIcon col="date" />
              </th>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between mt-3">
        <BulkControls />
        <span className="text-[13px] text-gray-600">
          {filteredPosts.length} item{filteredPosts.length !== 1 ? "s" : ""}
        </span>
      </div>
    </section>
  );
}
