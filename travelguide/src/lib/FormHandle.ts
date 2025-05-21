import { toast } from "svelte-sonner";
import { activities } from "./store";

export const handler = ({
    formElement,
    formData,
    action,
    cancel,
    submitter,
    controller,
}: {
    action: URL;
    formData: FormData;
    formElement: HTMLFormElement;
    controller: AbortController;
    submitter: HTMLElement | null;
    cancel: () => void;
}) => {
    return async ({ result, update }) => {
        if (result.type === 'success' && result.data?.activities) {
            activities.set(result.data.activities);
        } else if (result.type === 'error') {
            // Handle error, possibly show a toast notification
            toast('Form submission failed:', result.error);
        }
        update();
    };
};