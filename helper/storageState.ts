export type UserType = 'authenticated' | 'cookiesOnly';

export function getStorageState(userType: UserType): string {
  switch (userType) {
    case 'authenticated':
      return 'storage/zara-auth.json'; // залогінений користувач
    case 'cookiesOnly':
      return 'storage/zara-cookies-only.json'; // прийняті cookies без логіну
    default:
      throw new Error(`Unknown user type: ${userType}`);
  }
}