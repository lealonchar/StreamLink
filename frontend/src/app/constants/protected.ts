/**
 * Dummy protected values.
 * Replace these with actual credentials before deploying.
 */
export class ProtectedConstants {
  private constructor() {
    throw new Error('Utility class should not be instantiated');
  }

  // No actual API keys needed for frontend at this time.
  // Mux credentials are server-side only.
  // Add any client-side keys here if required in the future.
  static readonly DUMMY_PLACEHOLDER = 'REPLACE_ME';
}
