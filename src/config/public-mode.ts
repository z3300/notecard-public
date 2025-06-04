/**
 * Configuration for public/private mode
 * In public mode, editing features are disabled
 */
export const isPublicMode = true;

export const publicModeConfig = {
  isPublic: isPublicMode,
  // Features that should be disabled in public mode
  features: {
    addContent: !isPublicMode,
    editContent: !isPublicMode,
    deleteContent: !isPublicMode,
    generateScreenshots: !isPublicMode,
  },
} as const; 