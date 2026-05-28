"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "react-quill-new/dist/quill.snow.css";
import { createPost } from "@/app/actions/post";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function CreatePostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Le titre et le contenu sont requis.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await createPost({
        title,
        wysiwygContent: content,
        image
      });
    } catch {
      setError("Une erreur est survenue.");
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-[1280px] mx-auto px-6 py-12">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Créer un article</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-sm font-medium text-gray-700">Titre</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de l'article"
              required
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="image" className="text-sm font-medium text-gray-700">URL de l'image</label>
            <input
              id="image"
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Contenu</label>
            <div className="rounded-lg border border-gray-300 overflow-hidden">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                className="bg-white [&_.ql-editor]:min-h-[240px] [&_.ql-editor]:text-gray-900"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              {submitting ? "Publication…" : "Publier"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:border-gray-900 hover:text-gray-900 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
