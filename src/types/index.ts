export interface Identity {
  persona: string;
  name: string;
  displayName: string;
  tagline: string;
  bio: string;
  didUri: string;
  avatarUrl?: string;
  bannerUrl?: string;
  protocols?: string[];
  permissions?: string[]; // Add this line
  webWallets: string[];
}
