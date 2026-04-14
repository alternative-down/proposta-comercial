import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockJwtVerify } = vi.hoisted(() => {
  return { mockJwtVerify: vi.fn() };
});

vi.mock('jose', () => ({
  SignJWT: function MockSignJWT(_payload: unknown) {
    return {
      setProtectedHeader: vi.fn().mockReturnThis(),
      setIssuedAt: vi.fn().mockReturnThis(),
      setExpirationTime: vi.fn().mockReturnThis(),
      sign: vi.fn().mockResolvedValue('mock.jwt.token'),
    };
  },
  jwtVerify: mockJwtVerify,
}));

import { signToken, verifyToken } from '../auth';

describe('signToken', () => {
  it('returns a promise resolving to a JWT string', async () => {
    const token = await signToken({ userId: 'user-123', email: 'test@example.com' });
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  it('accepts arbitrary extra fields in payload', async () => {
    const token = await signToken({ userId: 'user-1', email: 'a@b.com', name: 'Test', role: 'admin' as const });
    expect(typeof token).toBe('string');
  });
});

describe('verifyToken', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns payload for valid token', async () => {
    const mockPayload = { userId: 'user-123', email: 'test@example.com' };
    mockJwtVerify.mockResolvedValueOnce({ payload: mockPayload });
    const result = await verifyToken('valid.token.here');
    expect(result).toEqual(mockPayload);
  });

  it('returns null on invalid token', async () => {
    mockJwtVerify.mockRejectedValueOnce(new Error('Invalid token'));
    const result = await verifyToken('bad.token');
    expect(result).toBeNull();
  });

  it('returns null when jwtVerify throws', async () => {
    mockJwtVerify.mockRejectedValueOnce(new Error('expired'));
    const result = await verifyToken('expired.token');
    expect(result).toBeNull();
  });
});