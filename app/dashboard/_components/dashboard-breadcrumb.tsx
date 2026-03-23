"use client";

import * as React from "react";

import {
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type DashboardBreadcrumbContextValue = {
  items: React.ReactNode;
  setItems: (items: React.ReactNode) => void;
};

const DashboardBreadcrumbContext =
  React.createContext<DashboardBreadcrumbContextValue | null>(null);

export function DashboardBreadcrumbProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = React.useState<React.ReactNode>(null);

  return (
    <DashboardBreadcrumbContext.Provider value={{ items, setItems }}>
      {children}
    </DashboardBreadcrumbContext.Provider>
  );
}

export function DashboardBreadcrumb({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = React.useContext(DashboardBreadcrumbContext);

  if (!context) {
    throw new Error(
      "DashboardBreadcrumb must be used within DashboardBreadcrumbProvider",
    );
  }

  React.useEffect(() => {
    context.setItems(children);

    return () => {
      context.setItems(null);
    };
  }, [children, context]);

  return null;
}

function DashboardBreadcrumbTrail({
  items,
}: {
  items: React.ReactNode;
}) {
  const normalizedItems = React.Children.toArray(items).filter(Boolean);

  if (normalizedItems.length === 0) {
    return (
      <BreadcrumbItem>
        <BreadcrumbPage>Dashboard</BreadcrumbPage>
      </BreadcrumbItem>
    );
  }

  return normalizedItems.map((item, index) => {
    const isLastItem = index === normalizedItems.length - 1;
    const itemClassName = isLastItem ? undefined : "hidden md:inline-flex";
    const separatorClassName = isLastItem ? undefined : "hidden md:block";

    return (
      <React.Fragment key={index}>
        <BreadcrumbItem className={itemClassName}>{item}</BreadcrumbItem>
        {!isLastItem ? (
          <BreadcrumbSeparator className={separatorClassName} />
        ) : null}
      </React.Fragment>
    );
  });
}

export function DashboardBreadcrumbItems() {
  const context = React.useContext(DashboardBreadcrumbContext);

  return <DashboardBreadcrumbTrail items={context?.items ?? null} />;
}
