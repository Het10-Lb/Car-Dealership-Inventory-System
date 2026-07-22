import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Home from '../Home';
import { getVehiclesAPI } from '../../services/api';
import { AuthProvider } from '../../context/AuthContext';

// Mock the API
vi.mock('../../services/api', () => ({
  getVehiclesAPI: vi.fn(),
}));

const mockCars = [
  {
    _id: '1',
    make: 'Audi',
    model: 'A7 Sportback',
    year: 2025,
    price: 176037,
    quantity: 5,
    category: 'Sedan',
    imageUrl: 'fake-audi.jpg',
  },
  {
    _id: '2',
    make: 'Bentley',
    model: 'Continental GT',
    year: 2024,
    price: 235000,
    quantity: 2,
    category: 'Coupe',
    imageUrl: 'fake-bentley.jpg',
  }
];

describe('Home Page (Car Inventory)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderHome = () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </AuthProvider>
    );
  };

  it('renders loading state initially', () => {
    getVehiclesAPI.mockImplementation(() => new Promise(() => {})); // pending promise
    renderHome();
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders CarCard components after fetching vehicles', async () => {
    getVehiclesAPI.mockResolvedValueOnce({ success: true, data: mockCars });
    
    renderHome();
    
    // Wait for the mock cars to be rendered
    await waitFor(() => {
      // The titles should be on the screen
      expect(screen.getByText('Audi A7 Sportback')).toBeInTheDocument();
      expect(screen.getByText('Bentley Continental GT')).toBeInTheDocument();
      
      // Prices should be formatted
      expect(screen.getByText(/\$176,037/)).toBeInTheDocument();
      
      // Check for elements that would exist inside a CarCard
      expect(screen.getAllByTestId('car-card')).toHaveLength(2);
    });
  });

  it('renders empty state if no vehicles returned', async () => {
    getVehiclesAPI.mockResolvedValueOnce({ success: true, data: [] });
    
    renderHome();
    
    await waitFor(() => {
      expect(screen.getByText(/No vehicles available/i)).toBeInTheDocument();
    });
  });
});
