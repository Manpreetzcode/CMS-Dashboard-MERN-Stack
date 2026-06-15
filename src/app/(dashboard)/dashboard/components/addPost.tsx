"use client";

import { useState, useRef, useCallback } from "react"

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/app/redux/store";
import { addPost, fetchPosts, Post, updatePost } from "@/app/redux/features/postSlice";
import { addCategory, Category } from "@/app/redux/features/categorySlice";
import type { RootState } from "@/app/redux/store";
import { useRouter } from "next/navigation";

// ─── Toolbar Button ───────────────────────────────────────────────────────────
function ToolbarButton({
  label,
  onClick,
  title,
}: {
  label: string;
  onClick: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title ?? label}
      onClick={onClick}
      className="px-2 py-1 text-xs border border-gray-300 rounded bg-white hover:bg-[#1a2939] hover:text-white hover:border-[#1a2939] text-[#1a2939] font-medium transition-all duration-150 active:scale-95 select-none whitespace-nowrap"
    >
      {label}
    </button>
  );
}

// ─── Side Panel ───────────────────────────────────────────────────────────────
function SidePanel({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-gray-200 rounded-md bg-white overflow-hidden shadow-sm">
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
        style={{ borderBottom: open ? "1px solid #e5e7eb" : "none" }}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-sm font-semibold" style={{ color: "var(--primarycolor)" }}>
          {title}
        </span>
        <span className="text-gray-400 text-sm transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
          ▾
        </span>
      </div>
      {open && <div className="px-4 py-3">{children}</div>}
    </div>
  );
}

// ─── Meta Row ─────────────────────────────────────────────────────────────────
// ─── Meta Row (with inline editing) ──────────────────────────────────────────
function MetaRow({
  icon,
  label,
  value,
  highlight,
  onEdit,
  editContent,
  isEditing,
}: {
  icon: string;
  label: string;
  value: string;
  highlight?: boolean;
  onEdit?: () => void;
  editContent?: React.ReactNode;
  isEditing?: boolean;
}) {
  return (
    <div className="py-1">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm">{icon}</span>
        <span className="text-xs text-gray-500">{label}</span>
        <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
          {value}
        </span>
        {highlight && !isEditing && (
          <button
            type="button"
            className="text-xs ml-auto"
            style={{ color: "var(--secondarycolor)" }}
            onClick={onEdit}
          >
            Edit
          </button>
        )}
      </div>
      {isEditing && editContent && (
        <div className="mt-1.5">{editContent}</div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AddEditPost({ mode = "Post", select }: { mode?: "Post" | "Page"; select?: Post }) {

  const categoryStore = useSelector((state: RootState) => state.Category);
  const ALL_CATEGORIES: Category[] = categoryStore.categories;

  const [title, setTitle] = useState(select?.title || "");
  const [postId, setPostId] = useState(select?._id || "");
  const [titleTouched, setTitleTouched] = useState(false);
  // FIX 1-4: all four state variables were missing their setter (broken destructuring).
  const [status, setStatus] = useState(select?.status || "Draft");
  const [visibility, setVisibility] = useState(select?.visibility || "Public");
  const [slug, setSlug] = useState(select?.slug || "");
  const [publishDate, setPublishDate] = useState(
    select?.publishDate || new Date().toISOString().slice(0, 16)
  );
  const [featuredImage, setFeaturedImage] = useState<{ link: string; alt: string } | null>(
    select?.featuredImage || null
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(select?.categories || []);
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [categories, setCategories] = useState<Category[]>(ALL_CATEGORIES);
  const [published, setPublished] = useState(false);
  const [codeContent, setCodeContent] = useState(select?.content || "");

  // FIX 5: wordCount now derives from codeContent so it stays accurate.
  const wordCount = codeContent.trim() === "" ? 0 : codeContent.trim().split(/\s+/).length;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [postMode] = useState(select?.postType || mode);

  const PostContent = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const [editingField, setEditingField] = useState<"status" | "visibility" | "publishDate" | null>(null);

  const exec = useCallback(
    (tag: string) => {
      const textarea = PostContent.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = codeContent.slice(start, end);
      const newContent =
        codeContent.slice(0, start) +
        `<${tag}>${selectedText}</${tag}>` +
        codeContent.slice(end);
      setCodeContent(newContent);
    },
    [codeContent]
  );

  const toggleCategory = (cat: string) =>
    setSelectedCategories((p) =>
      p.includes(cat) ? p.filter((c) => c !== cat) : [...p, cat]
    );

  const addNewCategory = async () => {
    const t = newCategory.trim();
    if (categories && t && !categories.some((c) => c.categoryId === t)) {
      setCategories((p) => [
        ...p,
        { categoryName: t, categoryId: t, categorySlug: t, categoryCount: 0 },
      ]);
      setSelectedCategories((p) => [...p]);
    }
      await dispatch(
        addCategory({
          categoryName:t,
        })
      );
    setNewCategory("");
    setShowNewCategoryInput(false);
  };

  const dispatch = useDispatch<AppDispatch>();


  const handlePublish = async () => {
    setTitleTouched(true);
    if (!title.trim()) return;

    const postData: Post = {
      title,
      slug,
      content: codeContent,
      status: "Published",
      visibility,
      publishDate,
      categories: selectedCategories,
      featuredImage,
      postType: postMode,
    };

    setPublished(true);
    setSidebarOpen(false);
    setTimeout(() => setPublished(false), 3000);

    try {
      if(!select){

      const result = await dispatch(addPost(postData)).unwrap();
      console.log("adde d Success:", result);
        router.push("/dashboard/" + mode.toLowerCase() + "/update/" + result.postId);
        await dispatch(fetchPosts());
      }else {     
    const result2 = await dispatch(updatePost({
      postId,
      slug,
      title,
      content: codeContent,
      status: "Published",
      visibility,
      publishDate,
      categories: selectedCategories,
      featuredImage,
      postType: postMode,
    })).unwrap();
     console.log("added Success 2:", result2);
      }
      await dispatch(fetchPosts());
      
    } catch (error) {
      console.error("adding Failed:", error);
    }
  };

  const titleError = titleTouched && !title.trim();

  // ── Sidebar content (shared between drawer & desktop panel) ──

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>
      {/* ── Mobile sidebar drawer overlay ── */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative ml-auto w-full max-w-sm h-full bg-gray-100 shadow-2xl overflow-y-auto flex flex-col">
            <div
              className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-gray-200"
              style={{ backgroundColor: "var(--primarycolor)" }}
            >
              <span className="text-white text-sm font-semibold">Post Settings</span>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="text-white text-lg leading-none hover:opacity-70"
              >
                ✕
              </button>
            </div>
            <div className="p-4 flex flex-col gap-4">
               {/* Skip for now */}
            </div>
          </div>
        </div>
      )}

      {/* ── Main layout ── */}
      <div className="max-w-[1280px] mx-auto px-3 lg:flex lg:gap-5 lg:items-start">

        {/* ════ LEFT / EDITOR ════ */}
        <div
          className={`flex-1 min-w-0 flex flex-col gap-4 ${
            isFullscreen ? "fixed inset-0 z-50 bg-white p-4 sm:p-6 overflow-auto" : ""
          }`}
        >
          {/* Title */}
          <div>
            <input
              type="text"
              placeholder="Add title"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setTitleTouched(true); }}
              onBlur={() => setTitleTouched(true)}
              className={`w-full text-xl sm:text-2xl font-light px-4 py-3 border rounded-md outline-none transition-all placeholder:text-gray-300 bg-white
                ${titleError
                  ? "border-red-400 ring-2 ring-red-100"
                  : "border-gray-300 focus:border-[var(--primarycolor)] focus:ring-2 focus:ring-blue-100"
                }`}
              style={{ color: "var(--foreground)" }}
            />
            {titleError && (
              <p className="text-red-500 text-xs mt-1.5 ml-1">⚠ Title is required before publishing.</p>
            )}
          </div>

          {/* Editor card */}
          <div className="border border-gray-300 rounded-md bg-white overflow-hidden">
            {/* Add Media row */}
            <div className="border-b border-gray-200 px-3 py-2 flex items-center justify-between flex-wrap gap-2">
              <button
                type="button"
                className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded border transition-all duration-200"
                style={{ borderColor: "var(--primarycolor)", color: "var(--primarycolor)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--primarycolor)";
                  (e.currentTarget as HTMLButtonElement).style.color = "white";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--primarycolor)";
                }}
              >
                <span>🎞</span>
                <span>Add Media</span>
              </button>
            </div>

            {/* Toolbar row */}
            <div className="border-b border-gray-200 bg-gray-50 px-3 pt-2 pb-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0 overflow-x-auto pb-1">
                  <div className="flex flex-wrap gap-1 min-w-max sm:min-w-0">
                    <ToolbarButton label="b"    title="Bold"          onClick={() => exec("b")} />
                    <ToolbarButton label="i"    title="Italic"        onClick={() => exec("i")} />
                    <ToolbarButton label="ul"   title="Bullet List"   onClick={() => exec("ul")} />
                    <ToolbarButton label="ol"   title="Numbered List" onClick={() => exec("ol")} />
                    <ToolbarButton label="li"   title="List Item"     onClick={() => exec("li")} />
                    <ToolbarButton label="code" title="Inline Code"   onClick={() => exec("pre")} />
                    <ToolbarButton label="H1"   title="Heading 1"     onClick={() => exec("h1")} />
                    <ToolbarButton label="H2"   title="Heading 2"     onClick={() => exec("h2")} />
                    <ToolbarButton label="H3"   title="Heading 3"     onClick={() => exec("h3")} />
                    <ToolbarButton label="h4"   title="Heading 4"     onClick={() => exec("h4")} />
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 pt-0.5">
                  <button
                    type="button"
                    title="Toggle Fullscreen"
                    onClick={() => setIsFullscreen((f) => !f)}
                    className="ml-1 p-1 text-gray-400 hover:text-[var(--primarycolor)] transition-colors text-base"
                  >
                    {isFullscreen ? "⊡" : "⛶"}
                  </button>
                </div>
              </div>
            </div>

            <textarea
              value={codeContent}
              ref={PostContent}
              onChange={(e) => setCodeContent(e.target.value)}
              className="w-full min-h-[220px] sm:min-h-[280px] p-4 text-xs font-mono outline-none bg-gray-900 text-green-400 resize-none"
              placeholder="<p>Your HTML content here...</p>"
            />

            {/* Word count */}
            <div className="border-t border-gray-200 px-4 py-2 text-xs text-gray-400 bg-gray-50">
              Word count: {wordCount}
            </div>
          </div>
        </div>

        {/* ════ RIGHT SIDEBAR — desktop only ════ */}
        <aside className="hidden lg:flex lg:flex-col lg:gap-4 lg:w-72 xl:w-[280px] shrink-0">
           <div className="flex flex-col gap-4">
      {/* Publish panel */}
      <SidePanel title="Publish">
  <div className="flex gap-2 mb-3">
    <button
      type="button"
      className="flex-1 py-2 text-xs border border-gray-300 rounded hover:bg-gray-50 text-[var(--primarycolor)] font-medium transition-all"
    >
      Save Draft
    </button>
    <button
      type="button"
      className="flex-1 py-2 text-xs border border-gray-300 rounded hover:bg-gray-50 text-[var(--primarycolor)] font-medium transition-all"
    >
      Preview
    </button>
  </div>

  {/* Status */}
  <MetaRow
    icon="🔑"
    label="Status:"
    value={status}
    highlight
    isEditing={editingField === "status"}
    onEdit={() => setEditingField("status")}
    editContent={
      <div className="flex flex-col gap-1">
        {["Draft", "Published"].map((s) => (
          <label key={s} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="status"
              value={s}
              checked={status === s}
              onChange={() => { setStatus(s); }}
              className="w-3.5 h-3.5"
              style={{ accentColor: "var(--primarycolor)" }}
            />
            <span className="text-xs text-gray-700">{s}</span>
          </label>
        ))}
        <button
          type="button"
          onClick={() => setEditingField(null)}
          className="mt-1 text-xs font-medium self-start"
          style={{ color: "var(--secondarycolor)" }}
        >
          OK
        </button>
      </div>
    }
  />

  {/* Visibility */}
  <MetaRow
    icon="👁"
    label="Visibility:"
    value={visibility}
    highlight
    isEditing={editingField === "visibility"}
    onEdit={() => setEditingField("visibility")}
    editContent={
      <div className="flex flex-col gap-1">
        {["Public", "Private"].map((v) => (
          <label key={v} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="visibility"
              value={v}
              checked={visibility === v}
              onChange={() => { setVisibility(v); }}
              className="w-3.5 h-3.5"
              style={{ accentColor: "var(--primarycolor)" }}
            />
            <span className="text-xs text-gray-700">{v}</span>
          </label>
        ))}
        <button
          type="button"
          onClick={() => setEditingField(null)}
          className="mt-1 text-xs font-medium self-start"
          style={{ color: "var(--secondarycolor)" }}
        >
          OK
        </button>
      </div>
    }
  />

  {/* Publish Date */}
  <MetaRow
    icon="📅"
    label="Publish"
    value={new Date(publishDate).toLocaleString()}
    highlight
    isEditing={editingField === "publishDate"}
    onEdit={() => setEditingField("publishDate")}
    editContent={
  <div className="flex flex-col gap-1.5">
    <input
      type="datetime-local"
      value={publishDate}
      onChange={(e) => setPublishDate(e.target.value)}
      className="border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-[var(--primarycolor)] w-full"
    />
    <button
      type="button"
      onClick={() => setEditingField(null)}
      className="mt-1 text-xs font-medium self-start"
      style={{ color: "var(--secondarycolor)" }}
    >
      OK
    </button>
  </div>
}
  />

  <button
    type="button"
    onClick={handlePublish}
    className="mt-3 w-full py-2.5 rounded text-sm font-semibold text-white transition-all duration-200 active:scale-95"
    style={{ backgroundColor: published ? "var(--secondarycolor)" : "var(--primarycolor)" }}
  >
    {select ? "Update" : "Publish"}
  </button>
</SidePanel>

      {/* Categories */}
      {postMode === "Post" && categories && (
        <SidePanel title="Categories">
          <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto pr-1 custom-scroll">
            {categories.map((cat) => (
              <label key={cat.categoryId} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.categoryId)}
                  onChange={() => toggleCategory(cat.categoryId)}
                  className="w-3.5 h-3.5"
                  style={{ accentColor: "var(--primarycolor)" }}
                />
                <span className="text-xs text-gray-700 group-hover:text-[var(--primarycolor)] transition-colors">
                  {cat.categoryName}
                </span>
              </label>
            ))}
          </div>

          {showNewCategoryInput ? (
            <div className="mt-3 flex gap-1">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addNewCategory()}
                placeholder="Category name"
                className="flex-1 min-w-0 border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-[var(--primarycolor)]"
              />
              <button
                type="button"
                onClick={addNewCategory}
                className="px-2 py-1 text-xs text-white rounded shrink-0"
                style={{ backgroundColor: "var(--primarycolor)" }}
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowNewCategoryInput(false)}
                className="px-2 py-1 text-xs border border-gray-300 rounded text-gray-500 hover:bg-gray-50 shrink-0"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowNewCategoryInput(true)}
              className="mt-3 text-xs font-medium hover:underline"
              style={{ color: "var(--secondarycolor)" }}
            >
              + Add Category
            </button>
          )}
        </SidePanel>
      )}

      {/* Featured Image */}
      <SidePanel title="Featured image">
        {featuredImage ? (
          <img
            src="dummy"
            alt="Featured"
            className="w-full h-32 object-cover rounded border border-gray-200"
          />
        ) : (
          <button type="button" className="text-xs hover:underline" style={{ color: "var(--secondarycolor)" }}>
            Set featured image
          </button>
        )}
      </SidePanel>
    </div>
        </aside>
      </div>

      {/* ── Mobile quick-publish sticky bar ── */}
      <div className="lg:hidden sticky bottom-0 z-40 border-t border-gray-200 bg-white px-4 py-3 flex gap-3 shadow-lg">
        <button
          type="button"
          className="flex-1 py-2 text-xs border border-gray-300 rounded font-medium text-[var(--primarycolor)] hover:bg-gray-50 transition-all"
        >
          Save Draft
        </button>
        <button
          type="button"
          onClick={handlePublish}
          className="flex-1 py-2 text-xs rounded font-semibold text-white transition-all active:scale-95"
          style={{ backgroundColor: published ? "var(--secondarycolor)" : "var(--primarycolor)" }}
        >
          {select ? "Update" : "Publish"}
        </button>
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="px-3 py-2 text-xs border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-all"
          title="Post Settings"
        >
          ⚙
        </button>
      </div>

      {/* ── Success toast ── */}
      {published && (
        <div
          className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 text-white text-sm px-4 py-3 rounded-lg shadow-xl flex items-center gap-2"
          style={{ backgroundColor: "var(--secondarycolor)" }}
        >
          <span>✓</span>
          <span>{select ? "Updated" : "Published"}! Check console for data.</span>
        </div>
      )}
    </div>
  );
}
