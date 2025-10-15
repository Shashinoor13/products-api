import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { PlusIcon } from "lucide-react";

function CreateProductButton() {
    const navigate = useNavigate();

    const openCreateModal = () => {
        navigate("?mode=create");
    };
    return (
        <Button onClick={openCreateModal}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Product
        </Button>
    );
}

export default CreateProductButton;