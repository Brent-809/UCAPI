import { Injectable } from "@nestjs/common";
@Injectable()
export class AuthService {
  // KEYS
  private apiKeys: string[] = [
    "dop_v1_9075187063a65e0041ca55e3bce103c2751bfeaa6e6ea2f0484c7f5c1dacf4ed",
  ];
  validateApiKey(apiKey: string) {
    return this.apiKeys.find((apiK) => apiKey === apiK);
  }
}
