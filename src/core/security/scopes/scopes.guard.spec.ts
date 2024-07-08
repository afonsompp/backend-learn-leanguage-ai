import { ScopesGuard } from './scopes.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';

describe('ScopesGuard', () => {
  let guard: ScopesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new ScopesGuard(reflector);
  });

  it('should allow access when no scopes are required', () => {
    const mockExecutionContext = createMockExecutionContext(null);

    jest.spyOn(reflector, 'get').mockReturnValue(null); // Mock reflector.get() to return null for 'scopes'

    const canActivate = guard.canActivate(
      mockExecutionContext as ExecutionContext,
    );

    expect(canActivate).toBeTruthy();
  });

  it('should allow access when user has required scopes', () => {
    const mockExecutionContext = createMockExecutionContext([
      'read:profile',
      'write:profile',
    ]);

    jest
      .spyOn(reflector, 'get')
      .mockReturnValue(['read:profile', 'write:profile']); // Mock reflector.get() to return required scopes

    const canActivate = guard.canActivate(
      mockExecutionContext as ExecutionContext,
    );

    expect(canActivate).toBeTruthy();
  });

  it('should throw ForbiddenException when user does not have required scopes', () => {
    const mockExecutionContext = createMockExecutionContext([
      'read:profile',
      'write:profile',
    ]);
    mockExecutionContext.switchToHttp().getRequest().user = {
      scope: ['read:profile'], // User has only 'read:profile', but 'write:profile' is required
    };

    jest
      .spyOn(reflector, 'get')
      .mockReturnValue(['read:profile', 'write:profile']); // Mock reflector.get() to return required scopes

    expect(() =>
      guard.canActivate(mockExecutionContext as ExecutionContext),
    ).toThrowError(ForbiddenException);
  });

  // Helper function to create a mock execution context
  function createMockExecutionContext(
    scopes: string[] | null,
  ): Partial<ExecutionContext> {
    return {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: { scope: scopes },
        }),
      }),
      getHandler: jest.fn().mockReturnValue({}),
    };
  }
});
