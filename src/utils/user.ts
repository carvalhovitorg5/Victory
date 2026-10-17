import { UserProfile } from '../types/game';

const USER_STORAGE_KEY = 'brasileirao_433_user_profile';

export function getStoredUserProfile(): UserProfile {
  if (typeof window === 'undefined') {
    return {
      id: 'guest_default',
      name: 'Craque Anônimo',
      nickname: 'Craque#433',
      isGoogleLinked: false,
    };
  }

  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }

  // Create default guest profile
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const defaultProfile: UserProfile = {
    id: `guest_${Date.now()}`,
    name: 'Técnico Convidado',
    nickname: `Mister#${randomSuffix}`,
    isGoogleLinked: false,
  };

  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(defaultProfile));
  } catch {
    // ignore
  }

  return defaultProfile;
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // ignore
  }
}
