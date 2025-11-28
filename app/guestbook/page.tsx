// app/guestbook/page.tsx
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { ClientPageTracker } from "@/components/ClientPageTracker";

const supabase = createClient();

type SimpleItem = {
  id: number;
  item: string;
  created_at: string | null;
};

export default function SimpleListPage() {
  const [session, setSession] = useState<any>(null);
  const [item, setItem] = useState("");
  const [items, setItems] = useState<SimpleItem[]>([]);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 로그인 상태 체크
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

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

  // 항목 추가
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session) {
      setError("로그인해야 항목을 추가할 수 있습니다.");
      return;
    }

    if (!item.trim()) return;

    setLoadingAdd(true);
    setError(null);

    const { error } = await supabase.from("simple_list").insert({
      item: item.trim(),
    });

    if (error) {
      console.error(error);
      setError(error.message);
    } else {
      setItem("");
      await fetchItems();
    }

    setLoadingAdd(false);
  };

  // 항목 삭제
  const handleDelete = async (id: number) => {
    if (!session) {
      setError("로그인해야 항목을 삭제할 수 있습니다.");
      return;
    }

    setDeletingId(id);
    setError(null);

    const { error } = await supabase.from("simple_list").delete().eq("id", id);

    if (error) {
      console.error(error);
      setError(error.message);
    } else {
      setItems((prev) => prev.filter((row) => row.id !== id));
    }

    setDeletingId(null);
  };

  return (
    <>
      <ClientPageTracker pageUrl="/guestbook" />
      
      <main className="min-h-screen flex flex-col items-center justify-start bg-gray-50 py-10 px-4">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-semibold mb-2">방명록 (공개)</h1>
          <p className="text-sm text-gray-500 mb-6">
            궁금하신 내용이 있으면 글을 남겨주세요! 
          </p>        
          <p className="text-sm text-gray-500 mb-6">
            로그인 없이 볼 수 있지만, 항목 추가/삭제는 로그인 후 가능합니다.
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
              disabled={loadingAdd || !session}
              className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              {session ? (loadingAdd ? "저장 중..." : "추가") : "로그인 필요"}
            </button>
          </form>

          {error && <p className="text-sm text-red-600 mb-3">에러: {error}</p>}

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
                {session && (
                  <button
                    onClick={() => handleDelete(row.id)}
                    disabled={deletingId === row.id}
                    className="text-xs rounded-md border border-red-500 text-red-500 px-2 py-1 hover:bg-red-50 disabled:opacity-50"
                  >
                    {deletingId === row.id ? "삭제 중..." : "삭제"}
                  </button>
                )}
              </li>
            ))}

            {items.length === 0 && (
              <li className="text-sm text-gray-500">아직 아무 항목도 없습니다.</li>
            )}
          </ul>
        </div>
      </main>
    </>
  );
}