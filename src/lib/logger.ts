export const logger = {
  error(error: unknown, context: string) {
    if (import.meta.env.DEV) {
      console.error(context, error);
      return;
    }
    console.error(context);
  },
  info(message: string, data?: unknown) {
    if (import.meta.env.DEV) {
      console.info(message, data);
    }
  }
};
