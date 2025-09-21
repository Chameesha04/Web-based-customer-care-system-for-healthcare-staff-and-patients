import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChatBubbleLeftRightIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { SupportTicketRequest, TicketCategory, TicketPriority } from '../../../types';
import apiService from '../../../services/api';

const SupportTicketForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: TicketCategory.GENERAL_INQUIRY,
    priority: TicketPriority.MEDIUM
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const ticketRequest: SupportTicketRequest = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority
      };

      await apiService.createSupportTicket(ticketRequest);
      navigate('/customer/support');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create support ticket');
      console.error('Ticket creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/customer/support')}
          className="p-2 text-gray-400 hover:text-gray-600"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Support Ticket</h1>
          <p className="mt-2 text-gray-600">Get help with your healthcare needs</p>
        </div>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DocumentTextIcon className="h-4 w-4 inline mr-1" />
              Subject *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Brief description of your issue..."
              className="input-field"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="input-field"
              required
            >
              <option value={TicketCategory.GENERAL_INQUIRY}>General Inquiry</option>
              <option value={TicketCategory.APPOINTMENT}>Appointment Issues</option>
              <option value={TicketCategory.BILLING}>Billing & Payment</option>
              <option value={TicketCategory.MEDICAL_RECORDS}>Medical Records</option>
              <option value={TicketCategory.TECHNICAL}>Technical Support</option>
              <option value={TicketCategory.COMPLAINT}>Complaint</option>
              <option value={TicketCategory.FEEDBACK}>Feedback</option>
              <option value={TicketCategory.EMERGENCY}>Emergency</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority Level
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value={TicketPriority.LOW}>Low</option>
              <option value={TicketPriority.MEDIUM}>Medium</option>
              <option value={TicketPriority.HIGH}>High</option>
              <option value={TicketPriority.URGENT}>Urgent</option>
              <option value={TicketPriority.CRITICAL}>Critical</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ChatBubbleLeftRightIcon className="h-4 w-4 inline mr-1" />
              Detailed Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Please provide detailed information about your issue or question..."
              className="input-field h-32 resize-none"
              required
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/customer/support')}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </div>
              ) : (
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Create Support Ticket
                </div>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Information Card */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckCircleIcon className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Support Information</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>We typically respond to support tickets within 24 hours</li>
                <li>Emergency tickets are prioritized and responded to immediately</li>
                <li>You can track your ticket status and add comments anytime</li>
                <li>For urgent medical issues, please contact emergency services</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTicketForm;

