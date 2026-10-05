export interface FileMetadata {
  name: string;
  mimeType: string;
  size: number;
  storageProvider?: string;
  storageKey?: string;
  url?: string;
  uploadedBy?: string;
  createdAt?: Date;
}
