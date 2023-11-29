import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenService {
  private readonly secret = 'DLW8MPYHDOH7XZC3C2OCXASWYDEZPFXK';

  // Helper function to create JWT token
  createToken(userId: string): string {
    // Set token expiration time to 1 hour from now
    const expiresIn = Math.floor(Date.now() / 1000) + 60 * 60;

    // Create token with user ID and expiration time as payload
    return jwt.sign({ userId, expiresIn }, this.secret);
  }
}
