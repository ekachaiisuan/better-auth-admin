'use client';
import { Button } from '@/components/ui/button';
import {
  Filter,
  Grid3X3,
  List,
  Plus,
  Search,
  Trello,
} from 'lucide-react';
import { useBoards } from '@/lib/hooks/useBoards';
import { Spinner } from '@/components/ui/spinner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function CreateDashboard() {
  const { createBoard, boards, loading, error } = useBoards();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const startOfCurrentWeek = new Date();
  startOfCurrentWeek.setHours(0, 0, 0, 0);
  startOfCurrentWeek.setDate(
    startOfCurrentWeek.getDate() - startOfCurrentWeek.getDay(),
  );

  const recentBoardsCount = boards.filter((board) => {
    const updatedAt = new Date(board.updatedAt);
    return updatedAt >= startOfCurrentWeek;
  }).length;

  const handleCreateBoard = async () => {
    await createBoard({ title: 'New Board' });
  };

  if (loading) {
    return (
      <div>
        <Spinner className="size-4" />
        Loading your boards...
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Error loading boards</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto py-6 px-4 sm:py-8 space-y-4">
        <Button className="w-full sm:w-auto" onClick={handleCreateBoard}>
          <Plus className="h-4 w-4 mr-2" />
          Create Board
        </Button>
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm sm:text-sm font-medium text-gray-600">
                    Total Boards
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {boards.length}
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Trello className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500"></Trello>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm sm:text-sm font-medium text-gray-600">
                    Recent Boards Week
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {recentBoardsCount}
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Trello className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500"></Trello>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm sm:text-sm font-medium text-gray-600">
                    Total Boards
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {boards.length}
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Trello className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500"></Trello>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm sm:text-sm font-medium text-gray-600">
                    Total Boards
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {boards.length}
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Trello className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500"></Trello>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Boards List */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                Your Boards
              </h2>
              <p className="text-gray-600">Manage your projects and tasks</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center  space-y-2 sm:space-y-0 space-x-2">
              <div className="flex items-center space-x-2 bg-white border p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3></Grid3X3>
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List></List>
                </Button>
              </div>
              <Button variant="default" size="sm">
                <Filter></Filter>
                Filter
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Board
              </Button>
              {/* Search */}
              <div className="relative mb-4sm:mb-6">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400"></Search>
                <Input
                  id="search"
                  placeholder="Search boards..."
                  className="pl-10"
                ></Input>
              </div>
            </div>
          </div>
          {/* Boards Grid/List */}
          {boards.length === 0 ? (
            <div>No boards found</div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {boards.map((board,key) => (
                <Link key={key} href={`/dashboard/${board.id}`}>
                  <Card className="้hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className={`w-4 h-4 ${board.color} rounded`}></div>
                        <Badge className='text-xs' variant="secondary">New</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p4 sm:p-6">
                      <CardTitle className='text-base sm:text-lg mb-2 group-hover:text-blue-600 transition-colors'>{board.title}</CardTitle>
                      <CardDescription className='text-sm mb-4'>{board.description}</CardDescription>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500">
                        <span>
                          Created
                          {new Date(board.createdAt).toLocaleDateString()}
                        </span>
                        <span>
                          Updated
                          {new Date(board.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
              <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursur-pointer group">
                <CardContent className='p-4 sm:p-6 flex flex-col items-center justify-center h-full min-h-50' >
                  <Plus className='h-6 w-6 sm:h-8 text-gray-400 group-hover:text-blue-600 mb-2'/>
                  <p className='text-sm sm:text-base text-gray-600 group-hover:text-blue-600 font-medium'>Create new board</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div>
              {boards.map((board,key) => (
                <div key={key} className={key > 0 ? 'mt-4' : ''}>
                <Link  href={`/dashboard/${board.id}`}>
                  <Card className="้hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className={`w-4 h-4 ${board.color} rounded`}></div>
                        <Badge className='text-xs' variant="secondary">New</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p4 sm:p-6">
                      <CardTitle className='text-base sm:text-lg mb-2 group-hover:text-blue-600 transition-colors'>{board.title}</CardTitle>
                      <CardDescription className='text-sm mb-4'>{board.description}</CardDescription>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500">
                        <span>
                          Created
                          {new Date(board.createdAt).toLocaleDateString()}
                        </span>
                        <span>
                          Updated
                          {new Date(board.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                </div>
              ))}
              <Card className="mt-4 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursur-pointer group">
                <CardContent className='p-4 sm:p-6 flex flex-col items-center justify-center h-full min-h-50' >
                  <Plus className='h-6 w-6 sm:h-8 text-gray-400 group-hover:text-blue-600 mb-2'/>
                  <p className='text-sm sm:text-base text-gray-600 group-hover:text-blue-600 font-medium'>Create new board</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
