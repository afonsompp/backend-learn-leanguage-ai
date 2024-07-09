import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { HttpStrategy } from './http.strategy';
import { AuthService } from '@core/security/auth/service/auth.service';
import { JwtClaims } from '@okta/jwt-verifier';

const mockJwtClaims: JwtClaims = {
  iss: 'https://example.com',
  sub: 'user123', // Example subject
  aud: 'your_app_client_id', // Example audience
  exp: Math.floor(Date.now() / 1000) + 3600, // Expiration in 1 hour
  nbf: Math.floor(Date.now() / 1000), // Not before now
  iat: Math.floor(Date.now() / 1000), // Issued at now
  jti: 'unique_jti', // Example JWT ID
  nonce: 'random_nonce', // Example nonce
  scp: ['read', 'write'], // Example scopes
  customClaim: 'custom_value', // Additional custom claim
};
describe('HttpStrategy', () => {
  let httpStrategy: HttpStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        HttpStrategy,
        {
          provide: AuthService,
          useValue: {
            validateToken: jest.fn(),
          },
        },
      ],
    }).compile();

    httpStrategy = moduleRef.get<HttpStrategy>(HttpStrategy);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(httpStrategy).toBeDefined();
  });

  it('should validate token successfully', async () => {
    const mockToken = 'valid-token';

    jest.spyOn(authService, 'validateToken').mockResolvedValue(mockJwtClaims);

    const result = await httpStrategy.validate(mockToken);
    expect(result).toEqual(mockJwtClaims);
  });

  it('should throw UnauthorizedException for invalid token', async () => {
    const mockToken = 'invalid-token';

    jest
      .spyOn(authService, 'validateToken')
      .mockRejectedValue(new Error('Invalid token'));

    await expect(httpStrategy.validate(mockToken)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
