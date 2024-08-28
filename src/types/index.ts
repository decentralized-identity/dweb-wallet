export interface Identity {
  id: number;
  name: string;
  avatarUrl: string;
  bannerUrl: string;
  protocols: string[];
  permissions: string[]; // Add this line
}
