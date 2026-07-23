import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminDashboard from '../AdminDashboard';
import { getVehiclesAPI, createVehicle, deleteVehicle } from '../../services/api';
import { AuthProvider } from '../../context/AuthContext';

// Mock the API calls
vi.mock('../../services/api', () => ({
  getVehiclesAPI: vi.fn(),
  createVehicle: vi.fn(),
  updateVehicle: vi.fn(),
  deleteVehicle: vi.fn(),
  uploadImage: vi.fn(),
}));

const mockCars = [
  {
    _id: '1',
    make: 'Audi',
    model: 'A7 Sportback',
    year: 2025,
    price: 176037,
    quantity: 12,
    category: 'Luxury Sedan',
    imageUrl: 'fake-audi.jpg',
  },
  {
    _id: '2',
    make: 'Bentley',
    model: 'Continental GT',
    year: 2024,
    price: 235000,
    quantity: 2,
    category: 'Supercar',
    imageUrl: 'fake-bentley.jpg',
  }
];

describe('AdminDashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderDashboard = () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <AdminDashboard />
        </BrowserRouter>
      </AuthProvider>
    );
  };

  it('renders loading state initially', () => {
    getVehiclesAPI.mockImplementationOnce(() => new Promise(() => {})); 
    renderDashboard();
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders quick stats and table rows after fetching vehicles', async () => {
    getVehiclesAPI.mockResolvedValueOnce({ success: true, data: mockCars });
    
    renderDashboard();
    
    await waitFor(() => {
      // Check for table rows (excluding header)
      const rows = screen.getAllByTestId('inventory-row');
      expect(rows).toHaveLength(2);
    });

    // Quick Stats checks
    expect(screen.getByText('14')).toBeInTheDocument(); // 12 + 2 Total Fleet
    expect(screen.getByText('Audi')).toBeInTheDocument();
    expect(screen.getByText('Bentley')).toBeInTheDocument();
  });

  it('opens Add Vehicle modal when "Add New Vehicle" button is clicked', async () => {
    getVehiclesAPI.mockResolvedValueOnce({ success: true, data: mockCars });
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText('Add New Vehicle')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Add New Vehicle'));
    
    expect(screen.getByTestId('add-vehicle-modal')).toBeInTheDocument();
  });

  it('submits a new vehicle successfully', async () => {
    getVehiclesAPI.mockResolvedValueOnce({ success: true, data: [] });
    createVehicle.mockResolvedValueOnce({ success: true, data: mockCars[0] });

    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText('Add New Vehicle')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Add New Vehicle'));

    const makeInput = screen.getByLabelText(/Make/i);
    const modelInput = screen.getByLabelText(/Model/i);
    const categoryInput = screen.getByLabelText(/Category/i);
    const priceInput = screen.getByLabelText(/Price/i);
    const quantityInput = screen.getByLabelText(/Quantity/i);
    const submitBtn = screen.getByRole('button', { name: /Save Vehicle/i });

    fireEvent.change(makeInput, { target: { value: 'Audi' } });
    fireEvent.change(modelInput, { target: { value: 'A7 Sportback' } });
    fireEvent.change(categoryInput, { target: { value: 'Luxury Sedan' } });
    fireEvent.change(priceInput, { target: { value: '176037' } });
    fireEvent.change(quantityInput, { target: { value: '12' } });

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(createVehicle).toHaveBeenCalledTimes(1);
      expect(createVehicle).toHaveBeenCalledWith(expect.objectContaining({
        make: 'Audi',
        model: 'A7 Sportback',
        price: 176037,
        quantity: 12,
        category: 'Luxury Sedan'
      }));
    });
  });

  it('calls delete API when delete button is clicked on a row', async () => {
    window.confirm = vi.fn().mockReturnValue(true);
    getVehiclesAPI.mockResolvedValueOnce({ success: true, data: mockCars });
    deleteVehicle.mockResolvedValueOnce({ success: true });

    renderDashboard();

    await waitFor(() => {
      expect(screen.getAllByTestId('inventory-row')).toHaveLength(2);
    });

    const deleteBtns = screen.getAllByTestId('delete-btn');
    fireEvent.click(deleteBtns[0]); // Delete first row (Audi, id: 1)

    await waitFor(() => {
      expect(deleteVehicle).toHaveBeenCalledWith('1');
    });
  });
});
