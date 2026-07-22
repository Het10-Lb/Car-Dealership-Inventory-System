import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Register from '../Register';
import { registerAPI } from '../../services/api';

// Mock the API and Router
vi.mock('../../services/api', () => ({
  registerAPI: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Register Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderRegister = () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
  };

  it('renders register form correctly', () => {
    renderRegister();
    
    // Check if the title is present
    expect(screen.getByText('EliteDrive')).toBeInTheDocument();
    expect(screen.getByText('Join the Network')).toBeInTheDocument();
    
    // Check if inputs are present
    expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('name@elitedrive.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('At least 8 characters')).toBeInTheDocument();
    
    // Check if submit button is present
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('allows user to toggle password visibility', () => {
    renderRegister();
    const passwordInput = screen.getByPlaceholderText('At least 8 characters');
    
    // Default is password
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Find the toggle button
    const toggleButton = passwordInput.nextElementSibling;
    fireEvent.click(toggleButton);
    
    // Should change to text
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Click again to hide
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('calls registerAPI and redirects on successful registration', async () => {
    registerAPI.mockResolvedValueOnce({ token: 'fake-jwt-token' });
    renderRegister();
    
    fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'John Smith' } });
    fireEvent.change(screen.getByPlaceholderText('name@elitedrive.com'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('At least 8 characters'), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    await waitFor(() => {
      expect(registerAPI).toHaveBeenCalledWith({ 
        name: 'John Smith', 
        email: 'john@example.com', 
        password: 'password123' 
      });
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });

  it('displays error message on failed registration', async () => {
    registerAPI.mockRejectedValueOnce({
      response: { data: { message: 'User already exists' } }
    });
    
    renderRegister();
    
    fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'Existing User' } });
    fireEvent.change(screen.getByPlaceholderText('name@elitedrive.com'), { target: { value: 'exists@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('At least 8 characters'), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    await waitFor(() => {
      expect(screen.getByText('User already exists')).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });
});
