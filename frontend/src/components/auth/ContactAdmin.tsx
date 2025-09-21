import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  UserIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const ContactAdmin: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    reason: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      // Simulate API call - in real implementation, this would send to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
    } catch (err) {
      setError('Failed to send request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailContact = () => {
    const adminEmail = 'admin@healthcare.com';
    const subject = 'Healthcare System Access Request';
    const body = `Hello Administrator,

I would like to request access to the Healthcare Management System.

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Desired Role: ${formData.role}
Reason: ${formData.reason}

Message:
${formData.message}

Thank you for your assistance.

Best regards,
${formData.name}`;

    window.open(`mailto:${adminEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Request Submitted!</h2>
            <p className="mt-2 text-sm text-gray-600">
              Your access request has been submitted successfully. Our administrator will review your request and contact you within 24 hours.
            </p>
            <div className="mt-6 space-y-4">
              <button
                onClick={handleEmailContact}
                className="btn-primary w-full"
              >
                <EnvelopeIcon className="h-5 w-5 mr-2" />
                Send Email Copy
              </button>
              <Link to="/login" className="btn-secondary w-full block text-center">
                <ArrowLeftIcon className="h-5 w-5 mr-2 inline" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-healthcare-500 to-healthcare-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              <UserIcon className="h-6 w-6" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Contact Administrator
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Request access to the Healthcare Management System
          </p>
        </div>

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

            <div>
              <label className="input-label">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="input-label">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter your email address"
                required
              />
            </div>

            <div>
              <label className="input-label">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="input-label">
                Desired Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="">Select a role</option>
                <option value="CUSTOMER">Customer/Patient</option>
                <option value="RECEPTIONIST">Receptionist</option>
                <option value="SMO">Senior Medical Officer</option>
                <option value="STAFF">Staff Member</option>
                <option value="SUPPORT">Support Staff</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>

            <div>
              <label className="input-label">
                Reason for Access
              </label>
              <select
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="">Select a reason</option>
                <option value="NEW_EMPLOYEE">New Employee</option>
                <option value="PATIENT_ACCESS">Patient Access</option>
                <option value="TEMPORARY_ACCESS">Temporary Access</option>
                <option value="ROLE_CHANGE">Role Change</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="input-label">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="input-field h-32 resize-none"
                placeholder="Please provide additional details about your access request..."
                required
              />
            </div>

            <div className="flex space-x-4">
              <Link to="/login" className="btn-secondary flex-1 text-center">
                <ArrowLeftIcon className="h-5 w-5 mr-2 inline" />
                Back to Login
              </Link>
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <EnvelopeIcon className="h-5 w-5 mr-2" />
                    Submit Request
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Contact Information */}
        <div className="card bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Direct Contact</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <EnvelopeIcon className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-blue-900">Email</p>
                <a 
                  href="mailto:admin@healthcare.com" 
                  className="text-sm text-blue-700 hover:text-blue-800"
                >
                  admin@healthcare.com
                </a>
              </div>
            </div>
            <div className="flex items-center">
              <PhoneIcon className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-blue-900">Phone</p>
                <a 
                  href="tel:+1-555-0123" 
                  className="text-sm text-blue-700 hover:text-blue-800"
                >
                  +1 (555) 012-3456
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactAdmin;

