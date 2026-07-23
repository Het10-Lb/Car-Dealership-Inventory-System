import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { getVehiclesAPI, createVehicle, deleteVehicle, updateVehicle, restockVehicle, uploadImage } from '../services/api';
import { 
  Car, 
  Banknote, 
  Tag, 
  AlertTriangle, 
  Filter, 
  Download, 
  Edit, 
  Trash2, 
  Package,
  Plus,
  X
} from 'lucide-react';

export default function AdminDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState(null);

  // Restock modal state
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [restockVehicleId, setRestockVehicleId] = useState(null);
  const [restockQuantity, setRestockQuantity] = useState(0);
  const [isRestocking, setIsRestocking] = useState(false);
  
  // Form state
  const initialFormData = { make: '', model: '', category: '', price: '', quantity: '' };
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await getVehiclesAPI();
      if (response.success && response.data) {
        setVehicles(response.data);
      } else if (Array.isArray(response)) {
        setVehicles(response);
      } else {
        setVehicles(response.data || []);
      }
    } catch (err) {
      setError('Failed to load vehicles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const totalFleet = vehicles.reduce((sum, v) => sum + (v.quantity || 0), 0);
  const stockValue = vehicles.reduce((sum, v) => sum + ((v.price || 0) * (v.quantity || 0)), 0);
  const lowStockAlerts = vehicles.filter(v => (v.quantity || 0) < 3).length;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const openAddModal = () => {
    setEditingVehicleId(null);
    setFormData(initialFormData);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle) => {
    setEditingVehicleId(vehicle._id);
    setFormData({
      make: vehicle.make,
      model: vehicle.model,
      category: vehicle.category,
      price: vehicle.price.toString(),
      quantity: vehicle.quantity.toString(),
    });
    setImageFile(null); // Optional: you can show current image preview if desired
    setIsModalOpen(true);
  };

  const openRestockModal = (vehicle) => {
    setRestockVehicleId(vehicle._id);
    setRestockQuantity(0);
    setIsRestockModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let imageUrl = '';
      if (imageFile) {
        const uploadRes = await uploadImage(imageFile);
        if (uploadRes.success || uploadRes.imageUrl) {
          imageUrl = uploadRes.imageUrl || uploadRes.data?.imageUrl;
        }
      }

      const vehiclePayload = {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        ...(imageUrl && { imageUrl })
      };

      if (editingVehicleId) {
        await updateVehicle(editingVehicleId, vehiclePayload);
      } else {
        await createVehicle(vehiclePayload);
      }

      setIsModalOpen(false);
      setFormData(initialFormData);
      setImageFile(null);
      setEditingVehicleId(null);
      fetchVehicles(); // Refresh list
    } catch (err) {
      console.error('Failed to save vehicle', err);
      alert('Failed to save vehicle');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    setIsRestocking(true);
    try {
      await restockVehicle(restockVehicleId, Number(restockQuantity));
      setIsRestockModalOpen(false);
      setRestockVehicleId(null);
      fetchVehicles();
    } catch (err) {
      console.error('Failed to restock', err);
      alert('Failed to restock vehicle');
    } finally {
      setIsRestocking(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await deleteVehicle(id);
        fetchVehicles();
      } catch (err) {
        console.error('Failed to delete', err);
        alert('Failed to delete vehicle');
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">Vehicle Inventory</h2>
          <p className="font-body-md text-body-md text-on-surface-variant opacity-70">Manage your high-performance fleet and stock levels.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-label-md text-label-md font-bold flex items-center gap-2 shadow-lg shadow-primary-container/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus size={20} />
          Add New Vehicle
        </button>
      </div>

      {/* Bento Grid - Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-container border border-outline-variant p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="p-2 bg-primary/10 text-primary rounded-lg">
              <Car size={24} />
            </span>
            <span className="text-tertiary font-label-sm">+12%</span>
          </div>
          <p className="text-on-surface-variant font-label-sm uppercase tracking-wider mb-1">Total Fleet</p>
          <p className="text-headline-md font-bold">{totalFleet}</p>
        </div>
        
        <div className="bg-surface-container border border-outline-variant p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="p-2 bg-tertiary/10 text-tertiary rounded-lg">
              <Banknote size={24} />
            </span>
            <span className="text-primary font-label-sm">+8.4%</span>
          </div>
          <p className="text-on-surface-variant font-label-sm uppercase tracking-wider mb-1">Stock Value</p>
          <p className="text-headline-md font-bold">
            ₹{stockValue >= 10000000 ? `${(stockValue / 1000000).toFixed(1)}M` : stockValue.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-surface-container border border-outline-variant p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="p-2 bg-secondary/10 text-secondary rounded-lg">
              <Tag size={24} />
            </span>
            <span className="text-error font-label-sm">-2.1%</span>
          </div>
          <p className="text-on-surface-variant font-label-sm uppercase tracking-wider mb-1">Avg. Sale Time</p>
          <p className="text-headline-md font-bold">14 Days</p>
        </div>
        
        <div className="bg-surface-container border border-outline-variant p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="p-2 bg-error/10 text-error rounded-lg">
              <AlertTriangle size={24} />
            </span>
            <span className="text-error font-label-sm">High</span>
          </div>
          <p className="text-on-surface-variant font-label-sm uppercase tracking-wider mb-1">Low Stock Alerts</p>
          <p className="text-headline-md font-bold">{lowStockAlerts}</p>
        </div>
      </div>

      {/* Data Table Container */}
      <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-high/50">
          <h3 className="font-headline-md text-headline-md">Inventory List</h3>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 bg-surface rounded border border-outline-variant text-label-md hover:bg-surface-container-high transition-colors">
              <Filter size={18} /> Filter
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-surface rounded border border-outline-variant text-label-md hover:bg-surface-container-high transition-colors">
              <Download size={18} /> Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center p-12">
              <div data-testid="loading-spinner" className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-container"></div>
            </div>
          ) : error ? (
            <div className="text-error text-center p-8 bg-surface-container rounded-xl border border-outline-variant">
              {error}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-highest/20">
                  <th className="px-6 py-4 font-label-sm text-label-sm uppercase tracking-widest text-outline">Make</th>
                  <th className="px-6 py-4 font-label-sm text-label-sm uppercase tracking-widest text-outline">Model</th>
                  <th className="px-6 py-4 font-label-sm text-label-sm uppercase tracking-widest text-outline">Category</th>
                  <th className="px-6 py-4 font-label-sm text-label-sm uppercase tracking-widest text-outline text-right">Price</th>
                  <th className="px-6 py-4 font-label-sm text-label-sm uppercase tracking-widest text-outline text-center">Quantity</th>
                  <th className="px-6 py-4 font-label-sm text-label-sm uppercase tracking-widest text-outline text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {vehicles.map(vehicle => (
                  <tr key={vehicle._id} data-testid="inventory-row" className="hover:bg-surface-container-high/30 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 rounded bg-surface-container flex items-center justify-center border border-outline-variant overflow-hidden">
                          <img 
                            className="w-full h-full object-cover" 
                            src={vehicle.imageUrl || "https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg"} 
                            alt={vehicle.make} 
                          />
                        </div>
                        <span className="font-bold">{vehicle.make}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-on-surface">{vehicle.model}</td>
                    <td className="px-6 py-5">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                        {vehicle.category}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right font-label-md font-bold text-primary">
                      ₹{vehicle.price?.toLocaleString()}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`font-label-md ${vehicle.quantity < 3 ? 'text-error' : ''}`}>
                        {vehicle.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => openEditModal(vehicle)}
                          className="p-2 hover:bg-surface-container-highest rounded text-on-surface-variant transition-all" 
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          data-testid="delete-btn"
                          onClick={() => handleDelete(vehicle._id)}
                          className="p-2 hover:bg-error/10 rounded text-error transition-all" 
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button 
                          onClick={() => openRestockModal(vehicle)}
                          className="p-2 hover:bg-tertiary/10 rounded text-tertiary transition-all" 
                          title="Restock"
                        >
                          <Package size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        <div className="px-6 py-4 bg-surface-container-highest/10 border-t border-outline-variant flex justify-between items-center">
          <p className="font-label-sm text-on-surface-variant">Showing 1-{vehicles.length} of {vehicles.length} results</p>
        </div>
      </div>

      {/* Modal: Add/Edit Vehicle */}
      {isModalOpen && (
        <div data-testid="add-vehicle-modal" className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface border border-outline-variant rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-surface border-b border-outline-variant px-6 py-4 flex justify-between items-center z-10">
              <h3 className="font-headline-md text-headline-md">{editingVehicleId ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="make" className="font-label-md text-label-md text-on-surface-variant">Make</label>
                  <input 
                    id="make"
                    name="make"
                    required
                    value={formData.make}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-body-md focus:outline-none focus:border-primary transition-all" 
                    placeholder="e.g. Porsche" 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="model" className="font-label-md text-label-md text-on-surface-variant">Model</label>
                  <input 
                    id="model"
                    name="model"
                    required
                    value={formData.model}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-body-md focus:outline-none focus:border-primary transition-all" 
                    placeholder="e.g. 911 GT3 RS" 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="category" className="font-label-md text-label-md text-on-surface-variant">Category</label>
                  <input 
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-body-md focus:outline-none focus:border-primary transition-all" 
                    placeholder="e.g. Track Focused" 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="price" className="font-label-md text-label-md text-on-surface-variant">Price (₹)</label>
                  <input 
                    id="price"
                    name="price"
                    type="number"
                    required
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-body-md focus:outline-none focus:border-primary transition-all" 
                    placeholder="e.g. 223800" 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="quantity" className="font-label-md text-label-md text-on-surface-variant">Initial Quantity</label>
                  <input 
                    id="quantity"
                    name="quantity"
                    type="number"
                    required
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-body-md focus:outline-none focus:border-primary transition-all" 
                    placeholder="e.g. 5" 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="image" className="font-label-md text-label-md text-on-surface-variant">Vehicle Image {editingVehicleId && '(Optional to update)'}</label>
                  <div className="w-full border-2 border-dashed border-outline-variant rounded-lg p-8 flex flex-col items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer relative">
                    <input 
                      id="image"
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="p-3 bg-surface rounded-full mb-3 text-primary">
                      <Plus size={24} />
                    </div>
                    <p className="font-label-md text-label-md text-on-surface">
                      {imageFile ? imageFile.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant mt-1 opacity-70">
                      SVG, PNG, JPG or GIF (max. 5MB)
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-6 border-t border-outline-variant mt-8">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 rounded-lg font-label-md text-label-md border border-outline-variant hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-primary-container text-on-primary-container px-6 py-2 rounded-lg font-label-md text-label-md font-bold hover:bg-primary-container/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : (editingVehicleId ? 'Update Vehicle' : 'Save Vehicle')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Restock Vehicle */}
      {isRestockModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface border border-outline-variant rounded-xl shadow-2xl w-full max-w-sm">
            <div className="border-b border-outline-variant px-6 py-4 flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md">Restock Vehicle</h3>
              <button 
                onClick={() => setIsRestockModalOpen(false)}
                className="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleRestockSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label htmlFor="restockQuantity" className="font-label-md text-label-md text-on-surface-variant">Quantity to Add</label>
                <input 
                  id="restockQuantity"
                  type="number"
                  min="1"
                  required
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-body-md focus:outline-none focus:border-primary transition-all" 
                  placeholder="e.g. 5" 
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsRestockModalOpen(false)}
                  className="px-6 py-2 rounded-lg font-label-md text-label-md border border-outline-variant hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isRestocking}
                  className="bg-primary-container text-on-primary-container px-6 py-2 rounded-lg font-label-md text-label-md font-bold hover:bg-primary-container/90 transition-colors disabled:opacity-50"
                >
                  {isRestocking ? 'Restocking...' : 'Restock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
