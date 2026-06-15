// redux/features/categorySlice.ts

import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";

export interface Category {
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  categoryCount: number;
}

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

/* =========================
   Fetch Categories
========================= */
export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string }
>(
  "category/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/category/fetch", {
        method: "GET",
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Failed to fetch categories"
        );
      }

      return data.categories.map((category: any) => ({
        categoryId: category.categoryId,
        categoryName: category.categoryName,
        categorySlug: category.categorySlug ?? "",
        categoryCount: category.categoryCount ?? 0,
      }));
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch categories"
      );
    }
  }
);

/* =========================
   Add Category
========================= */
export const addCategory = createAsyncThunk<
  Category,
  { categoryName: string },
  { rejectValue: string }
>(
  "category/addCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/category/add", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Failed to add category"
        );
      }

      return {
        categoryId: data.category.categoryId,
        categoryName: data.category.categoryName,
        categorySlug: data.category.categorySlug ?? "",
        categoryCount: data.category.categoryCount ?? 0,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to add category"
      );
    }
  }
);

/* =========================
   Remove Category
========================= */
export const removeCategory = createAsyncThunk<
  { categoryId: string },
  { categoryId: string },
  { rejectValue: string }
>(
  "category/removeCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/category/remove", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Failed to remove category"
        );
      }

      return {
        categoryId: categoryData.categoryId,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to remove category"
      );
    }
  }
);

/* =========================
   Slice
========================= */
const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },

    setCategories: (
      state,
      action: PayloadAction<Category[]>
    ) => {
      state.categories = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      /* Fetch Categories */
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to fetch categories";
      })

      /* Add Category */
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to add category";
      })

      /* Remove Category */
      .addCase(removeCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCategory.fulfilled, (state, action) => {
        state.loading = false;

        state.categories = state.categories.filter(
          (category) =>
            category.categoryId !== action.payload.categoryId
        );
      })
      .addCase(removeCategory.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to remove category";
      });
  },
});

export const {
  clearCategoryError,
  setCategories,
} = categorySlice.actions;

export default categorySlice.reducer;