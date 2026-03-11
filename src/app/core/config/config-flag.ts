export const FEATURE_FLAGS = {
  categoriesEnabled: 'feature_categories_enabled',
} as const;

export type FeatureFlagKey = (typeof FEATURE_FLAGS)[keyof typeof FEATURE_FLAGS];
