import axios from 'axios';
import { toast } from 'sonner';

const handleApiError = (error: unknown, defaultMsg: string): never => {
  let message = defaultMsg;

  if (axios.isAxiosError(error)) {
    message =
      (error.response?.data as { message?: string })?.message ??
      error.message ??
      defaultMsg;
  } else if (error instanceof Error) {
    message = error.message;
  }

  console.error('API Error:', error);
  toast.error(message);
  throw new Error(message);
};

export default handleApiError;
