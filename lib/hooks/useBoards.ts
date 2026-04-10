"use client";

import { type Board, type ColumnWithTasks } from "@/db/schema";
import {
  createBoardAction,
  createTaskAction,
  getBoardWithColumnsAction,
  getBoardsAction,
  moveTaskAction,
  reorderColumnTasksAction,
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

  async function loadBoard() {
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
  }

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
    if (!boardId) return;

    void (async () => {
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
    })();
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
  async function moveTask(
    taskId: string,
    newColumnId: string,
    newSortOrder: number,
    updateLocal = true,
  ) {
    try {
      await moveTaskAction(taskId, newColumnId, newSortOrder);
      if (updateLocal) {
        setColumns((prev) => {
          const newColumns = [...prev];
          let taskToMove: ColumnWithTasks["tasks"][number] | null = null;

          for (const col of newColumns) {
            const taskIndex = col.tasks.findIndex((task) => task.id === taskId);
            if (taskIndex !== -1) {
              taskToMove = col.tasks[taskIndex];
              col.tasks.splice(taskIndex, 1);
              break;
            }
          }
          if (taskToMove) {
            //Add task to new column
            const targetColumn = newColumns.find((col) => col.id === newColumnId);
            if (targetColumn) {
              targetColumn.tasks.splice(newSortOrder, 0, taskToMove);
            }
          }
          return newColumns;
        });
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to move task",
      );
      await loadBoard();
    }
  }

  async function reorderColumn(columnId: string, taskIds: string[]) {
    try {
      await reorderColumnTasksAction(columnId, taskIds);
      setColumns((prev) =>
        prev.map((column) =>
          column.id === columnId
            ? {
                ...column,
                tasks: column.tasks
                  .map((task) => ({
                    ...task,
                    sortOrder: taskIds.indexOf(task.id),
                  }))
                  .sort((a, b) => a.sortOrder - b.sortOrder),
              }
            : column,
        ),
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to reorder tasks",
      );
      await loadBoard();
    }
  }

  return {
    board,
    columns,
    loading,
    error,
    updateBoard,
    createRealTask,
    setColumns,
    moveTask,
    reorderColumn,
  };
}
