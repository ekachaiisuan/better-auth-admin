"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SelectContent,
  SelectItem,
  Select,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { useBoard } from "@/lib/hooks/useBoards";
import { Filter, MoreHorizontal, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { type ColumnWithTasks } from "@/db/schema";


function Column({
  column,
  children,
  onCreateTask,
  onEditColumn,
}: {
  column: ColumnWithTasks;
  children: React.ReactNode;
  onCreateTask: (taskData: any) => Promise<void>;
  onEditColumn: (column: ColumnWithTasks) => void;
}) {
  return (
    <div className="w-full lg:shrink-0">
      <div className="bg-muted rounded-lg shadow-sm border">
        {/* Column header */}
        <div className="p-3 sm:p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <h3 className="text-sm font-semibold">{column.title}</h3>
              <Badge variant="secondary" className="text-xs shrink-0">
                {column.tasks.length}
              </Badge>
            </div>
            <Button value="ghost" size="sm" className="shrink-0">
              <MoreHorizontal />
            </Button>
          </div>
        </div>
        {/* Column content */}
        <div className="p-3 sm:p-4">{children}</div>
      </div>
    </div>
  );
}

export default function BoardPage() {
  const { id } = useParams<{ id: string }>();
  const { board, updateBoard, columns, createRealTask } = useBoard(id);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState("");
  const [filterCount, setFilterCount] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  function onEditBoard() {
    setNewTitle(board?.title || "");
    setNewColor(board?.color || "");
    setIsEditingTitle(true);
    setFilterCount(2);
  }

  async function handleUpdateBoard(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newTitle.trim() || !board) return;
    try {
      await updateBoard(board.id, {
        title: newTitle.trim(),
        color: newColor || board.color,
      });
      setIsEditingTitle(false);
    } catch (error) {}
  }

  async function createTask(taskData: {
    title: string;
    description?: string;
    assignee?: string;
    dueDate?: string;
    priority: "low" | "medium" | "high";
  }) {
    const targetColumn = columns[0];
    if (!targetColumn) {
      throw new Error("No columns available to add task to.");
    }
    await createRealTask(targetColumn.id, taskData);
  }

  async function handleCreateTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const taskData = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || undefined,
      assignee: (formData.get("assignee") as string) || undefined,
      dueDate: (formData.get("dueDate") as string) || undefined,
      priority:
        (formData.get("priority") as "low" | "medium" | "high") || "medium",
    };
    if (taskData.title.trim()) {
      await createTask(taskData);
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink>Trello</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {board?.title}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7"
                      onClick={onEditBoard}
                    >
                      <MoreHorizontal />
                    </Button>
                  </BreadcrumbPage>

                  <Button
                    value="outline"
                    size="sm"
                    className={`text-xs sm:text-sm ${
                      filterCount > 0 ? "bg-blue-100 border-blue-200" : ""
                    }`}
                    onClick={() => setIsFilterOpen(true)}
                  >
                    <Filter className="h-3 w-3 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Filter</span>
                    {filterCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="text-xs ml-1 sm:ml-2"
                      >
                        {filterCount}
                      </Badge>
                    )}
                  </Button>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <Dialog open={isEditingTitle} onOpenChange={setIsEditingTitle}>
          <DialogContent className="w-[95vw] max-w-106.25 mx-auto">
            <DialogHeader>
              <DialogTitle>Edit Board</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleUpdateBoard}>
              <div className="space-y-2">
                <label htmlFor="boardTitle">Board Title</label>
                <Input
                  id="boardTitle"
                  placeholder="Enter board title..."
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label>Board Color</label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {[
                    "bg-blue-500",
                    "bg-green-500",
                    "bg-yellow-500",
                    "bg-red-500",
                    "bg-purple-500",
                    "bg-pink-500",
                    "bg-gray-500",
                    "bg-indigo-500",
                    "bg-orange-500",
                    "bg-teal-500",
                    "bg-cyan-500",
                    "bg-lime-500",
                  ].map((color) => (
                    <button
                      key={color}
                      className={`h-8 w-8 rounded-full ${color}${
                        color === newColor
                          ? " ring-2 ring-offset-2 ring-primary"
                          : ""
                      }`}
                      type="button"
                      onClick={() => setNewColor(color)}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditingTitle(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Change</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DialogContent className="w-[95vw] max-w-106.25 mx-auto">
            <DialogHeader>
              <DialogTitle>Filter Tasks</DialogTitle>
              <p className="text-sm text-gray-600">
                Filter tasks by priority,assignee, or due date
              </p>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label>Priority</label>
                <div className="flex flex-wrap gap-2">
                  {["low", "medium", "high"].map((priority, key) => (
                    <Button key={key} variant={"outline"} size="sm">
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              {/* <div className="space-y-2">
                <label>Assignee</label>
                <div className="flex flex-wrap gap-2">
                  {["low", "medium", "high"].map((priority, key) => (
                    <Button key={key} variant={"outline"} size="sm">
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Button>
                  ))}
                </div>
              </div> */}
              <div className="space-y-2">
                <label>Due Date</label>
                <Input type="date"></Input>
              </div>
              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline">
                  Clear Filters
                </Button>
                <Button type="button" onClick={() => setIsFilterOpen(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        {/* Board Content */}
        <div className="min-h-screen bg-gray-100">
          <main className="container mx-auto py-6 px-4 sm:py-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <div className="text-sm text-gray-600">
                  <span>Total Tasks:</span>
                  {columns.reduce((sum, col) => sum + col.tasks.length, 0)}
                </div>
              </div>
              {/* Add task button */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <Plus />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-106.25 mx-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <p className="text-sm text-gray-600">
                      Add a new task to the board
                    </p>
                  </DialogHeader>
                  <form className="space-y-4" onSubmit={handleCreateTask}>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Enter task title"
                      ></Input>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Enter task description"
                        rows={3}
                      ></Textarea>
                    </div>
                    <div className="space-y-2">
                      <Label>Assignee</Label>
                      <Input
                        id="assignee"
                        name="assignee"
                        placeholder="Who should this task be assigned to?"
                      ></Input>
                    </div>
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select name="priority" defaultValue="medium">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["low", "medium", "high"].map((priority, key) => (
                            <SelectItem key={key} value={priority}>
                              {priority.charAt(0).toUpperCase() +
                                priority.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Due Date</Label>
                      <Input type="date" id="dueDate" name="dueDate"></Input>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="submit">Create Task</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div>
              {columns.map((column, key) => (
                <Column
                  key={key}
                  column={column}
                  onCreateTask={() => {}}
                  onEditColumn={() => {}}
                >
                  <div>
                    {column.tasks.map((task, key) => (
                      <div>{task.title}</div>
                    ))}
                  </div>
                </Column>
              ))}
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
