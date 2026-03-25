'use server';

import {
  boardDataService,
  boardService,
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
