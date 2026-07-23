import DashboardLayout from '../components/DashboardLayout';
import { Bell } from 'lucide-react';

export default function Notifications() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-500">
        <div className="bg-surface-container rounded-full p-8 mb-6 text-primary border border-outline-variant">
          <Bell size={64} className="animate-pulse" />
        </div>
        <h1 className="text-display-sm font-display-sm text-on-surface mb-4 text-center">
          Notification feature Coming Soon
        </h1>
        <p className="text-body-lg text-on-surface-variant max-w-md text-center opacity-80">
          We're working hard to bring you real-time updates for your purchases, support tickets, and system alerts. Stay tuned!
        </p>
      </div>
    </DashboardLayout>
  );
}
