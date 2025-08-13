export interface TosResponse {
  version: string;
  content: string;
  createdAt: string;
}

export interface AcceptTosRequest {
  version: string;
}
