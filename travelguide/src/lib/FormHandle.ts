import { toast } from "svelte-sonner";
import { activities } from "./store";

export const handler = ({
    formElement,
    formData,
    action,
    cancel,
    submitter,
}: {
    action: URL;
    formData: FormData;
    formElement: HTMLFormElement;
    controller: AbortController;
    submitter: HTMLElement | null;
    cancel: () => void;
}) => {
    return async ({ result, update }) => {
        activities.set(result.data.activities)
        update();
    };
};