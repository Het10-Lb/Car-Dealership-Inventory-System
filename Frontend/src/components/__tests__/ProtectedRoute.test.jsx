import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProtectedRoute from '../ProtectedRoute';
import { useAuth } from '../../context/AuthContext';

// Mock the useAuth hook
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const MockDashboard = () => <div data-testid="dashboard">Dashboard Content</div>;
const MockLogin = () => <div data-testid="login">Login Page</div>;
const MockAdmin = () => <div data-testid="admin">Admin Content</div>;
const MockForbidden = () => <div data-testid="forbidden">Forbidden</div>;

const renderWithRouter = (initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/login" element={<MockLogin />} />
        
        {/* User Route */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<MockDashboard />} />
        </Route>
        
        {/* Admin Route */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin" element={<MockAdmin />} />
        </Route>
        
        {/* Catch-all for forbidden or not found could be added, 
            but for now ProtectedRoute defaults to returning null or redirecting 
            if we don't handle it explicitly, or we can just check redirect. */}
      </Routes>
    </MemoryRouter>
  );
};

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state when loading is true', () => {
    vi.mocked(useAuth).mockReturnValue({
      loading: true,
      token: null,
      role: null,
    });

    const { container } = renderWithRouter('/dashboard');
    // Assuming loading spinner is rendered
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('redirects to /login if no token exists', () => {
    vi.mocked(useAuth).mockReturnValue({
      loading: false,
      token: null,
      role: null,
    });

    renderWithRouter('/dashboard');
    expect(screen.getByTestId('login')).toBeInTheDocument();
    expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument();
  });

  it('allows access to protected route if token exists', () => {
    vi.mocked(useAuth).mockReturnValue({
      loading: false,
      token: 'valid-token',
      role: 'user',
    });

    renderWithRouter('/dashboard');
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
  });

  it('blocks non-admin users from admin routes (redirects to home/dashboard)', () => {
    vi.mocked(useAuth).mockReturnValue({
      loading: false,
      token: 'valid-token',
      role: 'user',
    });

    renderWithRouter('/admin');
    // Implementation should redirect non-admins back to user area (e.g. /home or /dashboard)
    // or render a Forbidden component. Let's assume it redirects to /home or similar
    // Since we don't have a /home route in the mock, we just ensure it doesn't render admin
    expect(screen.queryByTestId('admin')).not.toBeInTheDocument();
  });

  it('allows admin users access to admin routes', () => {
    vi.mocked(useAuth).mockReturnValue({
      loading: false,
      token: 'valid-token',
      role: 'admin',
    });

    renderWithRouter('/admin');
    expect(screen.getByTestId('admin')).toBeInTheDocument();
  });
});
