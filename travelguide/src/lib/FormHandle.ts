import { toast } from "svelte-sonner";
import { config } from "./store.svelte";

type HandlerInput = {
    action: URL;
    formData: FormData;
    formElement: HTMLFormElement;
    controller: AbortController;
    submitter: HTMLElement | null;
    cancel: () => void;
}

export function handler({ formElement, formData, act, cancel, submitter, controller }: HandlerInput) {
    return async ({ result, update }) => {
        if (result.type === 'success' && result.data?.activities) {
            config.activities = result.data.activities;
            config.hasSearched = true;
        }
        else if (result.type === 'success' && result.data?.itinerary) {
            config.itinerary = result.data.itinerary;
            config.hasItinerate = true;
        } else if (result.type === 'error') {
            toast.error('Form submission failed', {
                description: result.error?.message || 'Please try again'
            });
        }
        // update();
    };
};