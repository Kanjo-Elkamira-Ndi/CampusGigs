export const ApiResponse = {
  success<T>(data: T, message = 'Success') {
    return { success: true, message, data }
  },
  error(message: string, errors?: unknown[]) {
    return { success: false, message, errors }
  },
}