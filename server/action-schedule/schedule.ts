import { asc, eq } from 'drizzle-orm';

import { db } from '@/db/drizzle';
import { boards, columns, type Board, type Column } from '@/db/schema';

export const boardService = {
  async getBoards(userId: string) {
    try {
      const result = await db
        .select()
        .from(boards)
        .where(eq(boards.userId, userId))
        .orderBy(asc(boards.createdAt));
      return result;
    } catch (error) {
      console.error('Error fetching boards:', error);
      throw new Error('Failed to fetch boards');
    }
  },
  async createBoard(
    board: Omit<Board, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Board> {
    try {
      const [newBoard] = await db.insert(boards).values(board).returning();
      return newBoard;
    } catch (error) {
      console.error('Error creating board:', error);
      throw new Error('Failed to create board');
    }
  },
};

export const columnService = {
    async getBoards(userId: string) {
    try {
      const result = await db
        .select()
        .from(boards)
        .where(eq(boards.userId, userId))
        .orderBy(asc(boards.createdAt));
      return result;
    } catch (error) {
      console.error('Error fetching boards:', error);
      throw new Error('Failed to fetch boards');
    }
  },
  async createColumn(
    column: Omit<Column, 'id' | 'createdAt'>,
  ): Promise<Column> {
    try {
      const [newColumn] = await db.insert(columns).values(column).returning();
      return newColumn;
    } catch (error) {
      console.error('Error creating column:', error);
      throw new Error('Failed to create column');
    }
  },
};

export const boardDataService = {
  async createBoardWithDefaultColumns(boardData: {
    title: string;
    description?: string;
    color?: string;
    userId: string;
  }) {
    const defaultColumns = [
      { title: 'To Do', sortOrder: 0 },
      { title: 'In Progress', sortOrder: 1 },
      { title: 'Review', sortOrder: 2 },
      { title: 'Done', sortOrder: 3 },
    ];
    let board: Board | null = null;

    try {
      const createdBoard = await boardService.createBoard({
        title: boardData.title,
        description: boardData.description ?? null,
        color: boardData.color ?? 'bg-blue-500',
        userId: boardData.userId,
      });
      board = createdBoard;

      await db.insert(columns).values(
        defaultColumns.map((column) => ({
          ...column,
          boardId: createdBoard.id,
          userId: boardData.userId,
        })),
      );

      return createdBoard;
    } catch (error) {
      if (board) {
        try {
          await db.delete(boards).where(eq(boards.id, board.id));
        } catch (cleanupError) {
          console.error('Error cleaning up board after column creation failure:', {
            boardId: board.id,
            cleanupError,
          });
        }
      }

      console.error('Error creating board with default columns:', {
        boardTitle: boardData.title,
        userId: boardData.userId,
        error,
      });
      throw new Error('Failed to create board with default columns');
    }
  },
};
