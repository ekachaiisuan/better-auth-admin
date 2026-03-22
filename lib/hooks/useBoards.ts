'use client';

import { type Board } from '@/db/schema';
import {
  createBoardAction,
  getBoardsAction,
} from '@/server/action-schedule/board';
import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { tr } from 'zod/v4/locales';

export function useBoards() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session) {
      loadBoards();
    }
  }, [session]);

  async function loadBoards() {
    try {
      setLoading(true);
      setError(null);
      const data = await getBoardsAction();
      setBoards(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to load boards',
      );
    } finally {
      setLoading(false);
    }
  }
  async function createBoard(boardData: {
    title: string;
    description?: string;
    color?: string;
  }) {
    try {
      const newBoard = await createBoardAction(boardData);
      setBoards((prev) => [newBoard, ...prev]);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to create board',
      );
    }
  }

  return { boards, loading, error, createBoard };
}
