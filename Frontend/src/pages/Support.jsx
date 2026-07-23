import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { createTicketAPI, getMyTicketsAPI, getAllTicketsAPI, resolveTicketAPI } from '../services/api';
import { MessageSquare, CheckCircle2, AlertCircle, Plus, Send, HelpCircle, Phone, Mail } from 'lucide-react';

const faqs = [
  { question: "How do I purchase a vehicle?", answer: "Navigate to the Cars Inventory, find your desired vehicle, and click the 'Buy Now' button." },
  { question: "How do I track my purchases?", answer: "You can view your complete purchase history under the 'Purchase History' tab in your dashboard." },
  { question: "Can I cancel a purchase?", answer: "Purchases are final once confirmed. If you need special assistance, please raise a support ticket." },
];

export default function Support() {
  const { role } = useAuth();
  const isAdmin = role === 'admin';
  const location = useLocation();

  const initialTab = location.state?.tab || (isAdmin ? 'tickets' : 'faq');
  const [activeTab, setActiveTab] = useState(initialTab);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // New Ticket State
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  // Admin Resolve State
  const [resolveText, setResolveText] = useState({});

  const showToast = (msg, type = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = isAdmin ? await getAllTicketsAPI() : await getMyTicketsAPI();
      setTickets(response.data);
    } catch (err) {
      showToast('Failed to load tickets', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'tickets') {
      fetchTickets();
    }
  }, [activeTab, isAdmin]);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      await createTicketAPI({ subject, message });
      setSubject('');
      setMessage('');
      showToast('Support ticket raised successfully!');
      setActiveTab('tickets');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to raise ticket', 'error');
    }
  };

  const handleResolveTicket = async (ticketId) => {
    const adminResponse = resolveText[ticketId];
    if (!adminResponse) {
      showToast('Please enter a resolution message', 'error');
      return;
    }
    
    try {
      await resolveTicketAPI(ticketId, adminResponse);
      showToast('Ticket resolved successfully!');
      setResolveText((prev) => ({ ...prev, [ticketId]: '' }));
      fetchTickets();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to resolve ticket', 'error');
    }
  };

  return (
    <DashboardLayout>
      {toast && (
        <div className={`fixed top-24 right-8 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl animate-bounce ${toast.type === 'success' ? 'bg-surface-container-high border-primary text-primary' : 'bg-error-container border-error text-on-error-container'}`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="font-label-md">{toast.message}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-display-sm font-display-sm text-on-surface mb-2">Support & Tickets</h1>
          <p className="text-body-lg text-on-surface-variant opacity-70">
            {isAdmin ? 'Manage and resolve customer support inquiries.' : 'Find answers, contact us, or raise a support ticket.'}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-outline-variant overflow-x-auto">
          {!isAdmin && (
            <>
              <button
                onClick={() => setActiveTab('faq')}
                className={`px-6 py-4 font-label-lg whitespace-nowrap transition-all ${activeTab === 'faq' ? 'text-primary border-b-2 border-primary font-bold bg-primary/5' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
              >
                FAQ & Contact
              </button>
              <button
                onClick={() => setActiveTab('new')}
                className={`px-6 py-4 font-label-lg whitespace-nowrap transition-all ${activeTab === 'new' ? 'text-primary border-b-2 border-primary font-bold bg-primary/5' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
              >
                Raise a Ticket
              </button>
            </>
          )}
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-6 py-4 font-label-lg whitespace-nowrap transition-all ${activeTab === 'tickets' ? 'text-primary border-b-2 border-primary font-bold bg-primary/5' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
          >
            {isAdmin ? 'All Tickets' : 'My Tickets'}
          </button>
        </div>

        {/* FAQ & Contact (User Only) */}
        {!isAdmin && activeTab === 'faq' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-headline-sm font-headline-sm text-on-surface flex items-center gap-2">
                <HelpCircle className="text-primary" /> Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="bg-surface-container rounded-xl p-6 border border-outline-variant">
                    <h3 className="font-bold text-title-md text-on-surface mb-2">{faq.question}</h3>
                    <p className="text-body-md text-on-surface-variant">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-headline-sm font-headline-sm text-on-surface flex items-center gap-2">
                <Phone className="text-primary" /> Contact Us
              </h2>
              <div className="bg-surface-container rounded-xl p-6 border border-outline-variant space-y-4">
                <div className="flex items-center gap-4 text-on-surface">
                  <div className="bg-primary/10 p-3 rounded-full text-primary">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-label-sm text-on-surface-variant">Phone Support</p>
                    <p className="font-bold">+91 9265923958</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-on-surface">
                  <div className="bg-primary/10 p-3 rounded-full text-primary">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-label-sm text-on-surface-variant">Email Support</p>
                    <p className="font-bold">support@elitedrive.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Raise a Ticket (User Only) */}
        {!isAdmin && activeTab === 'new' && (
          <div className="max-w-2xl bg-surface-container rounded-2xl border border-outline-variant p-8 animate-in fade-in duration-500">
            <h2 className="text-headline-sm font-headline-sm text-on-surface mb-6 flex items-center gap-2">
              <Plus className="text-primary" /> Raise a New Ticket
            </h2>
            <form onSubmit={handleCreateTicket} className="space-y-6">
              <div className="space-y-2">
                <label className="text-label-md font-bold text-on-surface-variant">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="E.g. Issue with my recent purchase"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-label-md font-bold text-on-surface-variant">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue in detail..."
                  rows={5}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full bg-primary text-on-primary py-3 rounded-xl font-label-lg font-bold hover:bg-primary/90 transition-colors"
              >
                <Send size={20} /> Submit Ticket
              </button>
            </form>
          </div>
        )}

        {/* Tickets List (Admin & User) */}
        {activeTab === 'tickets' && (
          <div className="space-y-4 animate-in fade-in duration-500">
            {loading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-container"></div>
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center p-12 bg-surface-container rounded-xl border border-outline-variant text-on-surface-variant">
                No tickets found.
              </div>
            ) : (
              tickets.map((ticket) => (
                <div key={ticket._id} className="bg-surface-container rounded-xl border border-outline-variant p-6 flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-label-sm font-bold ${ticket.status === 'Resolved' ? 'bg-primary/20 text-primary' : 'bg-error-container text-on-error-container'}`}>
                        {ticket.status}
                      </span>
                      <span className="text-label-sm text-on-surface-variant opacity-70">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                      {isAdmin && ticket.user && (
                        <span className="text-label-sm text-primary font-bold bg-primary/10 px-2 py-1 rounded-md">
                          {ticket.user.name} ({ticket.user.email})
                        </span>
                      )}
                    </div>
                    <h3 className="text-title-lg font-bold text-on-surface">{ticket.subject}</h3>
                    <p className="text-body-md text-on-surface-variant">{ticket.message}</p>
                    
                    {ticket.status === 'Resolved' && (
                      <div className="mt-4 bg-surface-container-low p-4 rounded-lg border-l-4 border-primary space-y-1">
                        <p className="text-label-sm font-bold text-primary">Admin Response:</p>
                        <p className="text-body-md text-on-surface">{ticket.adminResponse}</p>
                      </div>
                    )}
                  </div>

                  {isAdmin && ticket.status === 'Open' && (
                    <div className="md:w-1/3 bg-surface-container-low p-4 rounded-xl border border-outline-variant space-y-3">
                      <h4 className="font-bold text-label-md text-on-surface">Resolve Ticket</h4>
                      <textarea
                        value={resolveText[ticket._id] || ''}
                        onChange={(e) => setResolveText((prev) => ({ ...prev, [ticket._id]: e.target.value }))}
                        placeholder="Type response to user..."
                        rows={3}
                        className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-sm text-on-surface focus:outline-none focus:border-primary resize-none"
                      />
                      <button
                        onClick={() => handleResolveTicket(ticket._id)}
                        className="w-full bg-primary text-on-primary py-2 rounded-lg font-label-md font-bold hover:bg-primary/90 transition-colors"
                      >
                        Mark as Resolved
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
