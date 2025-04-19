// Generic Toast Function
export const toastLoading = (title: string): string => `Loading ${title}...`;

export const toastUpdating = (title: string): string => `Updating ${title}...`;

export const toastLoadingSuccess = (title: string): string =>
  `${title} loaded successfully!`;

export const toastLoadingError = (title: string): string =>
  `Failed to load ${title}. Please try again.`;

export const toastUpdatingSuccess = (title: string): string =>
  `${title} updated successfully!`;

export const toastUpdatingError = (title: string): string =>
  `Failed to update ${title}. Please try again.`;

// Generic Toast Function for Adding
export const toastAdding = (title: string): string => `Adding ${title}...`;

export const toastAddingSuccess = (title: string): string =>
  `${title} added successfully!`;

export const toastAddingError = (title: string): string =>
  `Failed to add ${title}. Please try again.`;

// Generic Toast Function for Deleting
export const toastDeleting = (title: string): string => `Deleting ${title}...`;

export const toastDeletingSuccess = (title: string): string =>
  `${title} deleted successfully!`;

export const toastDeletingError = (title: string): string =>
  `Failed to delete ${title}. Please try again.`;
