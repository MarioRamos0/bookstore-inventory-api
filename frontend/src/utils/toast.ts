import { toast } from "sonner";
import { ApiClientError, ApiResponse } from "@/services/apiClient";

function formatStatus(status: number, statusText: string): string {
  return statusText ? `${status} ${statusText}` : `${status}`;
}

export function notifyApiSuccess<T>(
  actionLabel: string,
  response: ApiResponse<T>,
  description?: string
) {
  toast.success(
    `${actionLabel} (${formatStatus(response.status, response.statusText)})`,
    { description }
  );
}

export function notifyApiError(error: unknown, fallbackMessage: string) {
  if (error instanceof ApiClientError) {
    const fieldMessages = Object.entries(error.details)
      .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
      .join(" | ");
    toast.error(`${error.backendMessage} (${error.statusLabel})`, {
      description:
        fieldMessages && fieldMessages !== error.backendMessage
          ? fieldMessages
          : undefined,
    });
    return;
  }

  if (error instanceof Error) {
    toast.error("Error de conexión", { description: error.message });
    return;
  }

  toast.error("Error", { description: fallbackMessage });
}
