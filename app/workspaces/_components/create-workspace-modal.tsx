import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCreateWorkspaceModal } from '@/lib/hooks/use-create-workspace';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


export const CreateWorkspaceModal = () => {
  const [open, setOpen] = useCreateWorkspaceModal();
  const handleClose = () => {
    setOpen(false);
    //Todo: reset form state
  };
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
        </DialogHeader>
        <form className='space-y-4'>
          <Input value="" disabled={false} required autoFocus minLength={3} placeholder='Workspace name e.g. Work,Personal,Home'></Input>
          <div className='flex justify-end'>
            <Button disabled={false}>
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
