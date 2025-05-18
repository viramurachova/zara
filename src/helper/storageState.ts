export type UserType = 'authenticated' | 'cookiesOnly';

export function getStorageState(userType: UserType): string {
  switch (userType) {
    case 'authenticated':
      return 'storage/zara-auth.json';
    case 'cookiesOnly':
      return 'storage/zara-cookies-only.json';
    default:
      throw new Error(`Unknown user type: ${userType}`);
  }
}