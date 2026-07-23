import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PurchaseHistory from './PurchaseHistory';
import { getMyPurchases } from '../services/api';

// Mock the API
vi.mock('../services/api', () => ({
  getMyPurchases: vi.fn(),
}));

const mockPurchases = [
  {
    _id: 'p1',
    vehicleId: { make: 'Toyota', model: 'Corolla', year: 2020 },
    priceAtPurchase: 20000,
    purchaseDate: '2023-10-01T10:00:00Z',
  },
  {
    _id: 'p2',
    vehicleId: { make: 'Honda', model: 'Civic', year: 2021 },
    priceAtPurchase: 22000,
    purchaseDate: '2023-10-05T12:00:00Z',
  },
];

describe('PurchaseHistory Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <BrowserRouter>
        <PurchaseHistory />
      </BrowserRouter>
    );
  };

  it('renders a table with transaction dates and prices', async () => {
    getMyPurchases.mockResolvedValueOnce({ success: true, data: mockPurchases });
    
    renderComponent();

    // Wait for the data to be rendered
    await waitFor(() => {
      // For Toyota Corolla
      expect(screen.getByText(/Toyota/i)).toBeInTheDocument();
      expect(screen.getByText(/Corolla/i)).toBeInTheDocument();
      expect(screen.getByText(/\$?20,?000/)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(new Date('2023-10-01T10:00:00Z').toLocaleDateString(), 'i'))).toBeInTheDocument(); 
      
      // For Honda Civic
      expect(screen.getByText(/Honda/i)).toBeInTheDocument();
      expect(screen.getByText(/Civic/i)).toBeInTheDocument();
      expect(screen.getByText(/\$?22,?000/)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(new Date('2023-10-05T12:00:00Z').toLocaleDateString(), 'i'))).toBeInTheDocument();
    });
  });
});
