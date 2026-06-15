"use client";

import AddPost from "../../../components/addPost";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { useEffect, useState } from "react";
import { Post, selectPost } from "@/app/redux/features/postSlice";

export default function UpdatePost() {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const [selPost, setSelPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handlePage = async () => {
      try {
        const postId = params?.id as string;

        if (!postId) return;

        const result: { message: string; post: Post } =
          await dispatch(selectPost(postId)).unwrap();

        setSelPost(result.post);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    handlePage();
  }, [params, dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!selPost) {
    return <div>Post not found</div>;
  }

  return <AddPost mode="Page" select={selPost} />;
}