import { Injectable } from "@nestjs/common";
@Injectable()
export class AuthService {
  private apiKeys: string[] = [
    process.env.ApiKey
  ];
  validateApiKey(apiKey: string) {
    return this.apiKeys.find((apiK) => apiKey === apiK);
  }
}
