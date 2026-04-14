'use client';

import { useGetWorkspaces } from '@/lib/hooks/use-get-workspaces';
import { useCreateWorkspaceModal } from '@/lib/hooks/use-create-workspace';
import {  useEffect, useMemo } from 'react';


export default function CreateWorkspaces() {
    const [open, setOpen] = useCreateWorkspaceModal();
  const { data, isLoading } = useGetWorkspaces();
  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (isLoading) return 
    if (workspaceId) {
      console.log('Workspace found, redirecting to it...');
    } else if (!open) {
      setOpen(true);
    }
  }, [isLoading, workspaceId]);

  return (
    <div></div>
  );
}
