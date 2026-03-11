export const FEATURE_FLAGS = {
  newCheckout: 'feature_new_checkout',
  newProfile: 'feature_new_profile',
} as const;

export type FeatureFlagKey = typeof FEATURE_FLAGS[keyof typeof FEATURE_FLAGS];