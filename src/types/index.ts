export interface Identity {
  name: string;
  didUri: string;
  avatarUrl?: string;
  bannerUrl?: string;
  protocols?: string[];
  permissions?: string[]; // Add this line
}
