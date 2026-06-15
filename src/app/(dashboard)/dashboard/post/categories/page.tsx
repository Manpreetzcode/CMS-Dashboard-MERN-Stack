"use client";

import React,{ useState } from "react";
import {Category} from "@/app/redux/features/categorySlice"
import { useSelector } from "react-redux";
import type { RootState } from "@/app/redux/store";

import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/app/redux/store";
import { addCategory,fetchCategories, removeCategory } from "@/app/redux/features/categorySlice";


export default function CategoryPage() {
  const categoryStore = useSelector(
    (state: RootState) => state.Category
  );

  const categories = categoryStore.categories;

  const dispatch = useDispatch<AppDispatch>();

  const [selected, setSelected] = useState<string[]>([]);
  const [quickEditId, setQuickEditId] = useState<string >("");
  const [quickEditName, setQuickEditName] = useState("");
  const [quickEditSlug, setQuickEditSlug] = useState("");
  const [OpenQuickEdit, setOpenQuickEdit] = useState<boolean>(false);
  const [bulkAction, setBulkAction] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleNameChange = (val: string) => {
    setFormName(val);
    setFormSlug(generateSlug(val));
  };

  const handleAddCategory = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formName.trim()) return;

  await dispatch(
    addCategory({
      categoryName: formName.trim(),
    })
  );

  await dispatch(fetchCategories());

  setFormName("");
  setFormSlug("");
  setQuickEditId("");
};

  const handleDelete = async  (id: string) => {
    if (!id) return;
    await dispatch(
      removeCategory({
        categoryId: id,
      })
    );

     await dispatch(fetchCategories());
  };

  const openQuickEdit = (cat: Category) => {
    setOpenQuickEdit(true);
    setQuickEditId(cat.categoryId);
    setQuickEditName(cat.categoryName);
    setQuickEditSlug(cat.categorySlug);
  };

  const handleQuickEditSave = () => {
    if (!quickEditId) return;
    const updated = categories.map((c) =>
      c.categoryId === quickEditId ? { ...c, categoryName: quickEditName, categorySlug: quickEditSlug } : c
    );
    const updatedCat = updated.find((c) => c.categoryId === quickEditId);
    console.log("Quick Edit Updated Category:", updatedCat);
    setOpenQuickEdit(false);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelected(checked ? filteredCategories.map((c) => c.categoryId) : []);
  };

  const handleSelect = (id: string, checked: boolean) => {
    setSelected((prev) => (checked ? [...prev, id] : prev.filter((s) => s !== id)));
  };

  const handleBulkApply = () => {
    if (bulkAction === "delete" && selected.length > 0) {
      console.log("Bulk Delete IDs:", selected);
      setSelected([]);
    }
  };

  var filteredCategories = categories.filter((c) =>
    c.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const allChecked =
    filteredCategories.length > 0 &&
    filteredCategories.every((c) => selected.includes(c.categoryId));

  // ─── Shared input class ───────────────────────────────────────────────────
  const inputCls =
    "w-full border border-[#1a2939]/30 rounded px-2.5 py-1.5 text-[13px] bg-white text-[#171717] " +
    "focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] transition-colors";

  const selectCls =
    "border border-[#1a2939]/30 rounded px-2.5 py-1.5 text-[13px] bg-white text-[#171717] " +
    "focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] transition-colors";


  const TableHeader = () => (
    <tr className="border-b-2 border-[#1a2939]/10 bg-[#1a2939]/[0.03]">
      <th className="w-8 px-3 py-2.5 text-left">
        <input
          type="checkbox"
          checked={allChecked}
          onChange={(e) => handleSelectAll(e.target.checked)}
          className="accent-[#22C55E] cursor-pointer w-3.5 h-3.5"
        />
      </th>
      {["Name ▲", "Slug ⇅", "Count ⇅"].map((h, i) => (
        <th
          key={h}
          className={`px-3 py-2.5 text-left text-[12px] font-semibold text-[#1a2939] uppercase tracking-wide whitespace-nowrap ${i === 1 ? "hidden sm:table-cell" : ""}`}
        >
          {h}
        </th>
      ))}
    </tr>
  );

  return (
        <main className="flex-1 ">
          {/* Page heading */}
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-2xl font-bold text-[#1a2939]">Categories</h1>
            <span className="text-xs text-[#1a2939]/50 hidden sm:block">Posts › Categories</span>
          </div>

          <div className="flex flex-col xl:flex-row gap-5">

            {/* ══ Add Category Form ══ */}
            <div className="xl:w-[320px] shrink-0">
              <div className="bg-white border border-[#1a2939]/10 rounded-lg shadow-sm overflow-hidden">
                {/* Form header */}
                <div className="bg-[#1a2939] px-4 py-3">
                  <h2 className="text-[14px] font-semibold text-white">Add New Category</h2>
                </div>

                <form onSubmit={handleAddCategory} className="p-4 space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block font-semibold text-[#1a2939] mb-1 text-[12px] uppercase tracking-wide">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className={inputCls}
                      placeholder="Category name"
                    />
                    <p className="text-[#1a2939]/50 mt-1 text-[11px] leading-snug">
                      The name is how it appears on your site.
                    </p>
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block font-semibold text-[#1a2939] mb-1 text-[12px] uppercase tracking-wide">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={formSlug}
                      onChange={(e) => setFormSlug(e.target.value)}
                      className={inputCls}
                      placeholder="url-friendly-name"
                    />
                    <p className="text-[#1a2939]/50 mt-1 text-[11px] leading-snug">
                      URL-friendly version — lowercase letters, numbers, and hyphens only.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#22C55E] hover:bg-[#16a34a] text-white font-semibold px-4 py-2 rounded text-[13px] transition-colors cursor-pointer shadow-sm"
                  >
                    Add New Category
                  </button>
                </form>
              </div>
            </div>

            {/* ══ Category Table ══ */}
            <div className="flex-1 min-w-0 space-y-3">

              {/* Top toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Bulk actions */}
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className={selectCls}
                >
                  <option value="">Bulk actions</option>
                  <option value="delete">Delete</option>
                </select>
                <button
                  onClick={handleBulkApply}
                  className="border border-[#1a2939]/20 bg-white text-[#1a2939] rounded px-3 py-1.5 text-[13px] hover:border-[#22C55E] hover:text-[#22C55E] transition-colors cursor-pointer font-medium"
                >
                  Apply
                </button>

                <div className="ml-auto flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search categories…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`${inputCls} w-44`}
                  />
                  <button className="border border-[#1a2939]/20 bg-white text-[#1a2939] rounded px-3 py-1.5 text-[13px] hover:border-[#22C55E] hover:text-[#22C55E] transition-colors cursor-pointer font-medium whitespace-nowrap">
                    Search
                  </button>
                </div>
              </div>

              {/* Count */}
              <p className="text-[#1a2939]/40 text-xs text-right">
                {filteredCategories.length} item{filteredCategories.length !== 1 ? "s" : ""}
              </p>

              {/* Table card */}
              <div className="bg-white border border-[#1a2939]/10 rounded-lg shadow-sm overflow-x-auto">
                <table className="w-full border-collapse text-[13px]">
                  <thead>
                    <TableHeader />
                  </thead>

                 <tbody>
  {filteredCategories.map((cat) => (
    <React.Fragment key={cat.categoryId}>
      {/* Normal row */}
      <tr
        className={`border-b border-[#1a2939]/8 group hover:bg-[#22C55E]/5 transition-colors
        ${quickEditId === cat.categoryId ? "hidden" : ""}`}
      >
        <td className="px-3 py-2.5">
          <input
            type="checkbox"
            checked={selected.includes(cat.categoryId)}
            onChange={(e) => handleSelect(cat.categoryId, e.target.checked)}
            className="accent-[#22C55E] cursor-pointer w-3.5 h-3.5"
          />
        </td>

        <td className="px-3 py-2.5">
          <span className="font-semibold text-[#1a2939] hover:text-[#22C55E] cursor-pointer transition-colors">
            {cat.categoryName}
          </span>

          <div className="flex items-center gap-1 text-xs mt-0.5 flex-wrap opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => openQuickEdit(cat)}
              className="text-[#1a2939]/60 hover:text-[#22C55E] cursor-pointer transition-colors"
            >
              Edit
            </button>
            <span className="text-[#1a2939]/20">|</span>

            <button onClick={() => handleDelete(cat.categoryId)} 
            className="text-red-500 hover:text-red-700 cursor-pointer transition-colors">Delete</button>
          </div>
        </td>

        <td className="px-3 py-2.5 text-[#1a2939]/60">
          {cat.categorySlug}
        </td>

        <td className="px-3 py-2.5">
          <span className="inline-flex items-center justify-center bg-[#22C55E]/10 text-[#16a34a] font-semibold rounded-full px-2 py-0.5 text-[11px] min-w-[24px]">
            {cat.categoryCount}
          </span>
        </td>
      </tr>

      {/* Quick Edit Row */}
      { (OpenQuickEdit === true && quickEditId === cat.categoryId ) && (
        <tr className="border-b border-[#1a2939]/10 bg-[#1a2939]/[0.02]">
          <td colSpan={5} className="p-0">
            <div className="p-4 border-l-4 border-[#22C55E]">
              <p className="font-bold text-[11px] uppercase tracking-widest text-[#22C55E] mb-3">
                Quick Edit
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block font-semibold text-[#1a2939] mb-1 text-[12px] uppercase tracking-wide">
                    Name
                  </label>

                  <input
                    type="text"
                    value={quickEditName}
                    onChange={(e) => setQuickEditName(e.target.value)}
                    className={inputCls}
                    autoFocus
                  />
                </div>

                <div className="flex-1">
                  <label className="block font-semibold text-[#1a2939] mb-1 text-[12px] uppercase tracking-wide">
                    Slug
                  </label>

                  <input
                    type="text"
                    value={quickEditSlug}
                    onChange={(e) => setQuickEditSlug(e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={handleQuickEditSave}
                  className="bg-[#22C55E] hover:bg-[#16a34a] text-white font-semibold px-4 py-1.5 rounded text-[13px] transition-colors cursor-pointer shadow-sm"
                >
                  Update Category
                </button>

                <button
                  onClick={() => setQuickEditId("")}
                  className="border border-[#1a2939]/20 bg-white text-[#1a2939] px-4 py-1.5 rounded text-[13px] hover:border-[#1a2939]/40 transition-colors cursor-pointer font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  ))}

  {filteredCategories.length === 0 && (
    <tr>
      <td colSpan={5} className="px-4 py-8 text-center text-[#1a2939]/40">
        No categories found.
      </td>
    </tr>
  )}
</tbody>

                  <tfoot>
                    <TableHeader />
                  </tfoot>
                </table>
              </div>

              {/* Bottom bulk actions */}
              <div className="flex items-center gap-2">
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className={selectCls}
                >
                  <option value="">Bulk actions</option>
                  <option value="delete">Delete</option>
                </select>
                <button
                  onClick={handleBulkApply}
                  className="border border-[#1a2939]/20 bg-white text-[#1a2939] rounded px-3 py-1.5 text-[13px] hover:border-[#22C55E] hover:text-[#22C55E] transition-colors cursor-pointer font-medium"
                >
                  Apply
                </button>
                <span className="text-[#1a2939]/40 text-xs ml-auto">
                  {filteredCategories.length} item{filteredCategories.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Footer notes */}
              <div className="text-[#1a2939]/50 text-[11px] space-y-1 border-t border-[#1a2939]/10 pt-4 leading-relaxed">
                <p>
                  Deleting a category does not delete its posts. Posts assigned only to the
                  deleted category are moved to{" "}
                  <strong className="text-[#1a2939]/70">Uncategorized</strong>. The default
                  category cannot be deleted.
                </p>
                <p>
                  Categories can be selectively converted to tags using the{" "}
                  <a href="#" className="text-[#22C55E] hover:underline font-medium">
                    category to tag converter
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </main>
  );
}