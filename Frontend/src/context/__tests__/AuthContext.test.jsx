import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '../AuthContext';
import * as jwtDecodeModule from 'jwt-decode';

// Mock jwt-decode
vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn(),
}));

// A test component to consume the AuthContext
const TestComponent = () => {
  const { user, role, token, logout, login } = useAuth();
  return (
    <div>
      <div data-testid="token">{token ? 'has_token' : 'no_token'}</div>
      <div data-testid="role">{role || 'no_role'}</div>
      <div data-testid="userId">{user?.id || 'no_id'}</div>
      <button onClick={logout}>Logout</button>
      <button onClick={() => login('new-fake-token')}>Login</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('initializes with no user when localStorage is empty', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('token')).toHaveTextContent('no_token');
    expect(screen.getByTestId('role')).toHaveTextContent('no_role');
  });

  it('initializes correctly when valid token is in localStorage', () => {
    localStorage.setItem('token', 'fake-valid-token');
    
    // Mock the decoded return
    vi.mocked(jwtDecodeModule.jwtDecode).mockReturnValue({
      id: '123',
      role: 'admin',
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(jwtDecodeModule.jwtDecode).toHaveBeenCalledWith('fake-valid-token');
    expect(screen.getByTestId('token')).toHaveTextContent('has_token');
    expect(screen.getByTestId('role')).toHaveTextContent('admin');
    expect(screen.getByTestId('userId')).toHaveTextContent('123');
  });

  it('clears state on logout', () => {
    localStorage.setItem('token', 'fake-valid-token');
    vi.mocked(jwtDecodeModule.jwtDecode).mockReturnValue({
      id: '123',
      role: 'user',
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('token')).toHaveTextContent('has_token');

    act(() => {
      screen.getByText('Logout').click();
    });

    expect(screen.getByTestId('token')).toHaveTextContent('no_token');
    expect(screen.getByTestId('role')).toHaveTextContent('no_role');
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('updates state on login', () => {
    // Start empty
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    vi.mocked(jwtDecodeModule.jwtDecode).mockReturnValue({
      id: '456',
      role: 'user',
    });

    act(() => {
      screen.getByText('Login').click();
    });

    expect(jwtDecodeModule.jwtDecode).toHaveBeenCalledWith('new-fake-token');
    expect(screen.getByTestId('token')).toHaveTextContent('has_token');
    expect(screen.getByTestId('role')).toHaveTextContent('user');
    expect(localStorage.getItem('token')).toBe('new-fake-token');
  });
});
