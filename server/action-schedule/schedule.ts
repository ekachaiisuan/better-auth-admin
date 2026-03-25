import "server-only";

import { asc, eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { boards, columns, type Board, type Column } from "@/db/schema";

export const boardService = {
  async getBoard(boardId: string): Promise<Board | null> {
    try {
      const result = await db.query.boards.findFirst({
        where: (boards, { eq }) => eq(boards.id, boardId),
      });

      return result ?? null;
    } catch (error) {
      console.error("Error fetching boards:", error);
      throw new Error("Failed to fetch boards");
    }
  },
  async getBoards(userId: string): Promise<Board[]> {
    try {
      const result = await db
        .select()
        .from(boards)
        .where(eq(boards.userId, userId))
        .orderBy(asc(boards.createdAt));
      return result;
    } catch (error) {
      console.error("Error fetching boards:", error);
      throw new Error("Failed to fetch boards");
    }
  },
  async createBoard(
    board: Omit<Board, "id" | "createdAt" | "updatedAt">,
  ): Promise<Board> {
    try {
      const [newBoard] = await db.insert(boards).values(board).returning();
      return newBoard;
    } catch (error) {
      console.error("Error creating board:", error);
      throw new Error("Failed to create board");
    }
  },
};

export const columnService = {
  async getColumns(boardId: string): Promise<Column[]> {
    try {
      const result = await db
        .select()
        .from(columns)
        .where(eq(columns.boardId, boardId))
        .orderBy(asc(columns.sortOrder));
      return result;
    } catch (error) {
      console.error("Error fetching columns:", error);
      throw new Error("Failed to fetch columns");
    }
  },
  async createColumn(
    column: Omit<Column, "id" | "createdAt">,
  ): Promise<Column> {
    try {
      const [newColumn] = await db.insert(columns).values(column).returning();
      return newColumn;
    } catch (error) {
      console.error("Error creating column:", error);
      throw new Error("Failed to create column");
    }
  },
};

export const boardDataService = {
  async getBoardWithColumns(boardId: string) {
    const [board, columns] = await Promise.all([
      boardService.getBoard(boardId),
      columnService.getColumns(boardId),
    ]);
    if (!board) {
      throw new Error("Board not found");
    }
    return { board, columns };
  },
  async createBoardWithDefaultColumns(boardData: {
    title: string;
    description?: string;
    color?: string;
    userId: string;
  }) {
    const defaultColumns = [
      { title: "To Do", sortOrder: 0 },
      { title: "In Progress", sortOrder: 1 },
      { title: "Review", sortOrder: 2 },
      { title: "Done", sortOrder: 3 },
    ];
    let board: Board | null = null;

    try {
      const createdBoard = await boardService.createBoard({
        title: boardData.title,
        description: boardData.description ?? null,
        color: boardData.color ?? "bg-blue-500",
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
          console.error(
            "Error cleaning up board after column creation failure:",
            {
              boardId: board.id,
              cleanupError,
            },
          );
        }
      }

      console.error("Error creating board with default columns:", {
        boardTitle: boardData.title,
        userId: boardData.userId,
        error,
      });
      throw new Error("Failed to create board with default columns");
    }
  },
};
