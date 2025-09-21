import React, { useState } from 'react';
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

const CustomerSupport: React.FC = () => {
  const [message, setMessage] = useState('');
  const [tickets, setTickets] = useState([
    {
      id: '1',
      title: 'Appointment scheduling issue',
      status: 'OPEN',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      title: 'Payment processing problem',
      status: 'RESOLVED',
      createdAt: '2024-01-10',
    },
  ]);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // TODO: Implement ticket submission
      console.log('Submitting ticket:', message);
      setMessage('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <ChatBubbleLeftRightIcon className="h-8 w-8 text-healthcare-600" />
        <h1 className="text-3xl font-bold text-gray-900">Customer Support</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Support Tickets */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">My Support Tickets</h2>
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-800">{ticket.title}</h3>
                    <p className="text-sm text-gray-600">Created: {ticket.createdAt}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    ticket.status === 'OPEN' 
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Create New Ticket */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Support Ticket</h2>
          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Describe your issue
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="input-field"
                placeholder="Please describe your issue in detail..."
                required
              />
            </div>
            <button type="submit" className="btn-primary flex items-center space-x-2">
              <PaperAirplaneIcon className="h-4 w-4" />
              <span>Submit Ticket</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupport;




