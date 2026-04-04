import { BreadcrumbLink, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { DashboardBreadcrumb } from '../_components/dashboard-breadcrumb';

export default function BoardPage() {
  return (
    <>
      <DashboardBreadcrumb>
        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        <BreadcrumbPage>New Board</BreadcrumbPage>
      </DashboardBreadcrumb>
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto py-6 px-4 sm:py-8 space-y-4">
          aaaaa
        </main>
      </div>
    </>
  );
}
