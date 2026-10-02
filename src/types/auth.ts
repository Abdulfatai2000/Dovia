export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
}

// Application-level starter type; Auth.js integration is deferred.
export interface AuthSession {
  user: UserProfile;
  expires: string;
}
