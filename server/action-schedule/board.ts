"use server";

import {
  boardDataService,
  boardService,
  taskService,
} from '@/server/action-schedule/schedule';
import { getCurrentUserId } from '@/server/user';

export async function getBoardsAction() {
  const userId = await getCurrentUserId();
  return await boardService.getBoards(userId);
}

export async function getBoardWithColumnsAction(boardId: string) {
  const userId = await getCurrentUserId();
  const data = await boardDataService.getBoardWithColumns(boardId);

  if (data.board.userId !== userId) {
    throw new Error("Board not found");
  }

  return data;
}

export async function createBoardAction(data: {
  title: string;
  description?: string;
  color?: string;
}) {
  const userId = await getCurrentUserId();

  return await boardDataService.createBoardWithDefaultColumns({
    ...data,
    userId,
  });
}

export async function updateBoardAction(
  boardId: string,
  updates: {
    title?: string;
    description?: string | null;
    color?: string | null;
  },
) {
  const userId = await getCurrentUserId();
  const board = await boardService.getBoard(boardId);

  if (!board || board.userId !== userId) {
    throw new Error("Board not found");
  }

  return await boardService.updateBoard(boardId, updates);
}

export async function createTaskAction(data: {
  columnId: string;
  title: string;
  description?: string | null;
  assignee?: string | null;
  dueDate?: string | null;
  priority?: "low" | "medium" | "high";
  sortOrder: number;
}) {
  const userId = await getCurrentUserId();
  const board = await boardDataService.getBoardWithColumnsByColumnId(data.columnId);

  if (!board || board.userId !== userId) {
    throw new Error("Board not found");
  }

  return await taskService.createTask({
    title: data.title,
    description: data.description ?? null,
    assignee: data.assignee ?? null,
    dueDate: data.dueDate ?? null,
    priority: data.priority ?? "medium",
    columnId: data.columnId,
    sortOrder: data.sortOrder,
  });
}
