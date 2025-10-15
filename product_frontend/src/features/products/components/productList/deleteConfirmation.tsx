import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TrashIcon } from "lucide-react";


const DeleteConfirmation = ({ 
  productName, 
  onConfirm 
}: { 
  productName: string; 
  onConfirm: () => void;
}) => {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="sm" variant="destructive">
          <TrashIcon className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900">Delete Product</h4>
            <p className="text-sm text-gray-600 mt-2">
              Are you sure you want to delete{" "}
              <span className="font-semibold">"{productName}"</span>? This action
              cannot be undone.
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" variant="destructive" onClick={handleConfirm}>
              Delete
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DeleteConfirmation;