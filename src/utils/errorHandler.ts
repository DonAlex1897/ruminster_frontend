export async function handleApiError(response: Response, defaultMessage: string): Promise<never> {
  let errorMessage = defaultMessage;
  
  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorData.title || defaultMessage;
  } catch {
    errorMessage = response.statusText || `HTTP ${response.status}`;
  }
  
  throw new Error(errorMessage);
}
