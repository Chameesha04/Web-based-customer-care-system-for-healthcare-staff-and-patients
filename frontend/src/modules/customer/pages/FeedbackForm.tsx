import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HeartIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import apiService from '../../../services/api';

const FeedbackForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    feedback: '',
    category: 'GENERAL',
    anonymous: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.feedback.trim()) {
      setError('Please provide your feedback');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await apiService.provideFeedback(formData.feedback);
      setSuccess(true);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          rating: 0,
          feedback: '',
          category: 'GENERAL',
          anonymous: false
        });
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
      console.error('Feedback submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/customer/dashboard')}
          className="p-2 text-gray-400 hover:text-gray-600"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Share Your Feedback</h1>
          <p className="mt-2 text-gray-600">Help us improve our healthcare services</p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex">
            <CheckCircleIcon className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Thank you!</h3>
              <p className="mt-1 text-sm text-green-700">Your feedback has been submitted successfully.</p>
            </div>
          </div>
        </div>
      )}

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

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <StarIcon className="h-4 w-4 inline mr-1" />
              Overall Rating
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleRatingClick(rating)}
                  className={`p-2 rounded-full transition-colors ${
                    rating <= formData.rating
                      ? 'text-yellow-400 bg-yellow-100'
                      : 'text-gray-300 hover:text-yellow-400'
                  }`}
                >
                  <StarIcon className="h-6 w-6 fill-current" />
                </button>
              ))}
            </div>
            {formData.rating > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {formData.rating === 1 && 'Poor'}
                {formData.rating === 2 && 'Fair'}
                {formData.rating === 3 && 'Good'}
                {formData.rating === 4 && 'Very Good'}
                {formData.rating === 5 && 'Excellent'}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value="GENERAL">General Feedback</option>
              <option value="APPOINTMENT">Appointment Experience</option>
              <option value="STAFF">Staff Service</option>
              <option value="FACILITY">Facility & Environment</option>
              <option value="TECHNICAL">Website/App Experience</option>
              <option value="SUGGESTION">Suggestion</option>
              <option value="COMPLAINT">Complaint</option>
            </select>
          </div>

          {/* Feedback */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <HeartIcon className="h-4 w-4 inline mr-1" />
              Your Feedback *
            </label>
            <textarea
              name="feedback"
              value={formData.feedback}
              onChange={handleInputChange}
              placeholder="Please share your thoughts about our healthcare services..."
              className="input-field h-32 resize-none"
              required
            />
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="anonymous"
              checked={formData.anonymous}
              onChange={handleInputChange}
              className="h-4 w-4 text-healthcare-600 focus:ring-healthcare-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Submit feedback anonymously
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/customer/dashboard')}
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
                  Submitting...
                </div>
              ) : (
                <div className="flex items-center">
                  <HeartIcon className="h-4 w-4 mr-2" />
                  Submit Feedback
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
            <HeartIcon className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Why Your Feedback Matters</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Your feedback helps us improve our healthcare services</li>
                <li>We use your input to enhance patient experience</li>
                <li>All feedback is reviewed by our management team</li>
                <li>We take both positive feedback and concerns seriously</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;

