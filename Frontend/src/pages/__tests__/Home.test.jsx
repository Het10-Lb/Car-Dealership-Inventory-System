import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Home from '../Home';
import { getVehiclesAPI, searchVehiclesAPI } from '../../services/api';
import { AuthProvider } from '../../context/AuthContext';

// Mock the API
vi.mock('../../services/api', () => ({
  getVehiclesAPI: vi.fn(),
  searchVehiclesAPI: vi.fn(),
}));

// Mock CarCard to isolate rendering
vi.mock('../../components/CarCard', () => ({
  default: () => <div data-testid="car-card">Mocked Car Card</div>
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

  const renderHome = (initialRoute = '/home') => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={[initialRoute]}>
          <Home />
        </MemoryRouter>
      </AuthProvider>
    );
  };

  it('renders loading state initially', () => {
    getVehiclesAPI.mockImplementationOnce(() => new Promise(() => {})); // pending promise
    renderHome();
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders CarCard components after fetching vehicles', async () => {
    getVehiclesAPI.mockResolvedValueOnce({ success: true, data: mockCars });
    
    renderHome();
    
    // Wait for the mock cars to be rendered
    await waitFor(() => {
      // First verify the cards rendered at all
      const cards = screen.getAllByTestId('car-card');
      expect(cards).toHaveLength(2);
    });
  });

  it('renders empty state if no vehicles returned', async () => {
    getVehiclesAPI.mockResolvedValueOnce({ success: true, data: [] });
    
    renderHome();
    
    await waitFor(() => {
      expect(screen.getByText(/No vehicles available/i)).toBeInTheDocument();
    });
  });

  it('calls searchVehiclesAPI when search query parameter is present', async () => {
    searchVehiclesAPI.mockResolvedValueOnce({ success: true, data: mockCars });
    
    renderHome('/home?q=Bentley');
    
    await waitFor(() => {
      expect(searchVehiclesAPI).toHaveBeenCalledWith({ q: 'Bentley' });
      expect(screen.getAllByTestId('car-card')).toHaveLength(2);
    });
  });
});
