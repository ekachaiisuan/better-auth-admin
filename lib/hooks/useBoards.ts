"use client";

import { type Board, type Column } from "@/db/schema";
import {
  createBoardAction,
  getBoardWithColumnsAction,
  getBoardsAction,
} from "@/server/action-schedule/board";
import { useEffect, useEffectEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { boardService } from "@/server/action-schedule/schedule";

export function useBoards() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = authClient.useSession();

  const loadBoards = useEffectEvent(async () => {
    if (!session) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getBoardsAction();
      setBoards(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load boards",
      );
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    if (session) {
      loadBoards();
    }
  }, [session]);

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
        error instanceof Error ? error.message : "Failed to create board",
      );
    }
  }

  return { boards, loading, error, createBoard };
}

export function useBoard(boardId: string) {
  const [board, setBoard] = useState<Board | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBoard = useEffectEvent(async () => {
    if (!boardId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getBoardWithColumnsAction(boardId);
      setBoard(data.board);
      setColumns(data.columns);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load boards",
      );
    } finally {
      setLoading(false);
    }
  });

  const updateBoard = async (boardId: string, updates: Partial<Board>) => {
    try {
      const updatedBoard = await boardService.updateBoard(boardId, updates);
      setBoard(updatedBoard);
      return updatedBoard;
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update board",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (boardId) {
      loadBoard();
    }
  }, [boardId]);

  return { board, columns, loading, error, updateBoard };
}
