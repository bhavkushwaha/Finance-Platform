import { useState, useRef  } from "react";

import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";

import { Button } from "@/components/ui/button";
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Select } from "@/components/select";

export const useSelectAccount = ():[()=> JSX.Element, ()=> Promise<unknown>]  =>{
    const accountQuery = useGetAccounts();
    const accountMutation = useCreateAccount();
    const onCreateAccount = (name:string) => accountMutation.mutate({
        name
    });
    const accountOptions = Array.isArray(accountQuery.data)
        ? accountQuery.data.map((account) => ({
        label : account.name,
        value : account.id,
    })) : [];
    
    const [promise,setPromise] = useState<{ 
        resolve: (value: string | undefined) => void 
    } | null>(null);
    const selectValue = useRef<string>();

    const confirm = () => new Promise((resolve, reject) => {
        setPromise({ resolve });
    });

    const handleClose = () => {
        setPromise(null);
    };

    const handleConfirm = () => {
        promise?.resolve(selectValue.current);
        handleClose();
    };

    const handleCancel = () => {
        promise?.resolve(undefined);
        handleClose();
    };

    const ConfirmationDialog = () => (
        <Dialog open={promise !== null}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                          Select Account  
                    </DialogTitle>
                    <DialogDescription>
                        Please select an account to continue.    
                    </DialogDescription>
                </DialogHeader>
                <Select 
                    placeholder="Select an account"
                    options={accountOptions}
                    onCreate={onCreateAccount}
                    onChange={(value) => selectValue.current = value}
                    disabled={accountQuery.isLoading || accountMutation.isPending}
                />
                <DialogFooter>
                    <Button
                        onClick={handleCancel}
                        variant="outline"
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} >                    
                        Confirm 
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

    return [ConfirmationDialog, confirm];
}
