export function getErrorAsString(error?: any): string {
  if (!error) {
    return "";
  }

  if (error.name || error.message) {
    return `Error name: ${error.name}\nError message: ${error.message}\nError stack: ${error.stack}`;
  } else {
    return JSON.stringify(error);
  }
}
