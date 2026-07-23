import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Login from '../Login';
import { loginAPI } from '../../services/api';
import { AuthProvider } from '../../context/AuthContext';

// Mock the API and Router
vi.mock('../../services/api', () => ({
  loginAPI: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderLogin = () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthProvider>
    );
  };

  it('renders login form correctly', () => {
    renderLogin();
    
    // Check if the title is present
    expect(screen.getByText('EliteDrive')).toBeInTheDocument();
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    
    // Check if inputs are present
    expect(screen.getByPlaceholderText('name@elitedrive.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    
    // Check if submit button is present
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('allows user to toggle password visibility', () => {
    renderLogin();
    const passwordInput = screen.getByPlaceholderText('••••••••');
    
    // Default is password
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Find the toggle button (the one inside the input group)
    // We can find it by looking for the button right next to the password input
    const toggleButton = passwordInput.nextElementSibling;
    fireEvent.click(toggleButton);
    
    // Should change to text
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Click again to hide
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('calls loginAPI and redirects on successful login', async () => {
    loginAPI.mockResolvedValueOnce({ data: { token: 'fake-jwt-token' } });
    renderLogin();
    
    fireEvent.change(screen.getByPlaceholderText('name@elitedrive.com'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(loginAPI).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
      // We'll skip testing the context state directly here since it's tested in AuthContext.test.jsx
      // We can just verify the navigation
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });

  it('displays error message on failed login', async () => {
    loginAPI.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } }
    });
    
    renderLogin();
    
    fireEvent.change(screen.getByPlaceholderText('name@elitedrive.com'), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'wrongpass' } });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });
});
