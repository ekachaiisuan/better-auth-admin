import { BreadcrumbLink, BreadcrumbPage } from "@/components/ui/breadcrumb";

import { DashboardBreadcrumb } from "./_components/dashboard-breadcrumb";
import CreateDashboard from "./_components/create-dashboard";

export default function Page() {
  return (
    <>
      <DashboardBreadcrumb>
        <BreadcrumbLink href="">Trello</BreadcrumbLink>
        <BreadcrumbPage>Dashboard</BreadcrumbPage>
      </DashboardBreadcrumb>
      <CreateDashboard />
    </>
  );
}
