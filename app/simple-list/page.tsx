"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client"; // or "@/utils/supabase/client"

const supabase = createClient();

type SimpleItem = {
  id: number;
  item: string;
  created_at: string | null;
};

export default function SimpleListPage() {
  const [item, setItem] = useState("");
  const [items, setItems] = useState<SimpleItem[]>([]);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 리스트 불러오기
  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("simple_list")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      setError(error.message);
      return;
    }

    setItems(data ?? []);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // 추가
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!item.trim()) return;

    setLoadingAdd(true);
    setError(null);

    const { error } = await supabase
      .from("simple_list")
      .insert({ item: item.trim() });

    if (error) {
      console.error(error);
      setError(error.message);
    } else {
      setItem("");
      await fetchItems();
    }

    setLoadingAdd(false);
  };

  // 삭제
  const handleDelete = async (id: number) => {
    setDeletingId(id);
    setError(null);

    const { error } = await supabase
      .from("simple_list")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      setError(error.message);
    } else {
      setItems((prev) => prev.filter((row) => row.id !== id));
    }

    setDeletingId(null);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-start bg-gray-50 py-10 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-2">Simple List (공개)</h1>
        <p className="text-sm text-gray-500 mb-6">
          로그인 없이 누구나 항목을 추가/삭제할 수 있는 예제입니다.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <input
            type="text"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="새 항목 입력"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loadingAdd}
            className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {loadingAdd ? "저장 중..." : "추가"}
          </button>
        </form>

        {error && (
          <p className="text-sm text-red-600 mb-3">에러: {error}</p>
        )}

        <ul className="space-y-2">
          {items.map((row) => (
            <li
              key={row.id}
              className="flex items-center justify-between rounded-md bg-white px-3 py-2 shadow-sm border border-gray-100"
            >
              <div className="flex flex-col">
                <span>{row.item}</span>
                <span className="text-[11px] text-gray-400">#{row.id}</span>
              </div>
              <button
                onClick={() => handleDelete(row.id)}
                disabled={deletingId === row.id}
                className="text-xs rounded-md border border-red-500 text-red-500 px-2 py-1 hover:bg-red-50 disabled:opacity-50"
              >
                {deletingId === row.id ? "삭제 중..." : "삭제"}
              </button>
            </li>
          ))}

          {items.length === 0 && (
            <li className="text-sm text-gray-500">
              아직 아무 항목도 없습니다.
            </li>
          )}
        </ul>
      </div>
    </main>
  );
}
