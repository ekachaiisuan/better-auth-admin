"use client";

import { type Board, type Column, type ColumnWithTasks } from "@/db/schema";
import {
  createBoardAction,
  createTaskAction,
  getBoardWithColumnsAction,
  getBoardsAction,
  updateBoardAction,
} from "@/server/action-schedule/board";
import { useEffect, useEffectEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";

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
  const [columns, setColumns] = useState<ColumnWithTasks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBoard = useEffectEvent(async () => {
    if (!boardId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getBoardWithColumnsAction(boardId);
      setBoard(data.board);
      setColumns(data.columnsWithTasks);
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
      const updatedBoard = await updateBoardAction(boardId, {
        title: updates.title,
        description: updates.description,
        color: updates.color,
      });
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

  async function createRealTask(
    columnId: string,
    taskData: {
      title: string;
      description?: string;
      assignee?: string;
      dueDate?: string;
      priority?: "low" | "medium" | "high";
    },
  ) {
    try {
      const newTask = await createTaskAction({
        title: taskData.title,
        description: taskData.description || null,
        assignee: taskData.assignee || null,
        dueDate: taskData.dueDate || null,
        priority: taskData.priority || "medium",
        columnId: columnId,
        sortOrder:
          columns.find((col) => col.id === columnId)?.tasks.length || 0,
      });
      setColumns((prev) =>
        prev.map((col) =>
          col.id === columnId
            ? {
                ...col,
                tasks: [...col.tasks, newTask],
              }
            : col,
        ),
      );
      return newTask;
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create task",
      );
    }
  }

  return { board, columns, loading, error, updateBoard, createRealTask };
}
