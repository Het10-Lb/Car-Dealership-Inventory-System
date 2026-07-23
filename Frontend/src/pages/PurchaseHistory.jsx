import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { getMyPurchases } from '../services/api';

export default function PurchaseHistory() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await getMyPurchases();
        if (response.success && response.data) {
           setPurchases(response.data);
        } else if (Array.isArray(response)) {
           setPurchases(response);
        } else {
           setPurchases(response.data || []);
        }
      } catch (err) {
        setError('Failed to load purchase history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-2 md:p-6 space-y-6">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">Purchase History</h2>
          <p className="font-body-md text-body-md text-on-surface-variant opacity-70">View the vehicles you have acquired.</p>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div data-testid="loading-spinner" className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-container"></div>
          </div>
        ) : error ? (
          <div className="text-error text-center p-8 bg-surface-container rounded-xl border border-outline-variant">
            {error}
          </div>
        ) : purchases.length === 0 ? (
          <div className="text-on-surface-variant text-center p-8 bg-surface-container rounded-xl border border-outline-variant">
            No purchase history found.
          </div>
        ) : (
          <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-high/50">
              <h3 className="font-headline-md text-headline-md">My Garage</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-highest/20">
                    <th className="px-6 py-4 font-label-sm text-label-sm uppercase tracking-widest text-outline">Make</th>
                    <th className="px-6 py-4 font-label-sm text-label-sm uppercase tracking-widest text-outline">Model</th>
                    <th className="px-6 py-4 font-label-sm text-label-sm uppercase tracking-widest text-outline text-right">Price Paid</th>
                    <th className="px-6 py-4 font-label-sm text-label-sm uppercase tracking-widest text-outline text-right">Purchase Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {purchases.map(purchase => (
                    <tr key={purchase._id} className="hover:bg-surface-container-high/30 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-8 rounded bg-surface-container flex items-center justify-center border border-outline-variant overflow-hidden">
                             <img className="w-full h-full object-cover" src={purchase.vehicle?.imageUrl || "https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg"} alt={`${purchase.vehicle?.make} ${purchase.vehicle?.model}`} />
                          </div>
                          <span className="font-bold text-on-surface">{purchase.vehicle?.make || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-on-surface">
                        {purchase.vehicle?.model || 'Unknown'} 
                      </td>
                      <td className="px-6 py-5 text-right font-label-md font-bold text-primary">
                        ₹{purchase.purchasePrice?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-5 text-right font-label-sm text-on-surface-variant">
                        {new Date(purchase.purchaseDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
