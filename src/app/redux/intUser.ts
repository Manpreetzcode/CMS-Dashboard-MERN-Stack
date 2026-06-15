"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import type { AppDispatch } from "@/app/redux/store";

import {
  fetchUser,
  fetchInstallStatus,
} from "@/app/redux/features/userSlice";

import { fetchPosts } from "@/app/redux/features/postSlice";

import { fetchCategories } from "@/app/redux/features/categorySlice";

export default function InitUser() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const init = async () => {
      try {
        await dispatch(fetchInstallStatus()).unwrap();
        await dispatch(fetchUser()).unwrap();
        await dispatch(fetchPosts()).unwrap();
        await dispatch(fetchCategories()).unwrap();
      } catch (error) {
        console.error("Initialization failed:", error);
      }
    };

    init();
  }, [dispatch]);

  return null;
}