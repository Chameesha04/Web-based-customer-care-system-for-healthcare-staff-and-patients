import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChatBubbleLeftRightIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PaperAirplaneIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { SupportTicket, TicketStatus, TicketPriority, TicketCategory, TicketComment } from '../../../types';
import apiService from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

const SupportTicketManagement: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<TicketCategory | 'ALL'>('ALL');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSupportTickets(0, 100);
      setTickets(response.content);
    } catch (err) {
      setError('Failed to load support tickets');
      console.error('Tickets error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTicket = async (ticketId: number) => {
    try {
      const ticketData = await apiService.getSupportTicket(ticketId);
      setSelectedTicket(ticketData.ticket);
      setShowTicketModal(true);
    } catch (err) {
      console.error('Failed to load ticket details:', err);
    }
  };

  const handleAddComment = async () => {
    if (!selectedTicket || !newComment.trim()) return;

    try {
      setSubmittingComment(true);
      const comment = await apiService.addTicketComment(selectedTicket.id, newComment);
      
      // Update the ticket with the new comment
      setSelectedTicket(prev => prev ? {
        ...prev,
        comments: [...(prev.comments || []), comment]
      } : null);
      
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN: return 'bg-yellow-100 text-yellow-800';
      case TicketStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-800';
      case TicketStatus.PENDING_CUSTOMER: return 'bg-orange-100 text-orange-800';
      case TicketStatus.PENDING_INTERNAL: return 'bg-purple-100 text-purple-800';
      case TicketStatus.RESOLVED: return 'bg-green-100 text-green-800';
      case TicketStatus.CLOSED: return 'bg-gray-100 text-gray-800';
      case TicketStatus.CANCELLED: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case TicketPriority.LOW: return 'bg-gray-100 text-gray-800';
      case TicketPriority.MEDIUM: return 'bg-blue-100 text-blue-800';
      case TicketPriority.HIGH: return 'bg-orange-100 text-orange-800';
      case TicketPriority.URGENT: return 'bg-red-100 text-red-800';
      case TicketPriority.CRITICAL: return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: TicketCategory) => {
    switch (category) {
      case TicketCategory.APPOINTMENT: return 'bg-blue-100 text-blue-800';
      case TicketCategory.BILLING: return 'bg-green-100 text-green-800';
      case TicketCategory.MEDICAL_RECORDS: return 'bg-purple-100 text-purple-800';
      case TicketCategory.TECHNICAL: return 'bg-yellow-100 text-yellow-800';
      case TicketCategory.GENERAL_INQUIRY: return 'bg-gray-100 text-gray-800';
      case TicketCategory.COMPLAINT: return 'bg-red-100 text-red-800';
      case TicketCategory.FEEDBACK: return 'bg-indigo-100 text-indigo-800';
      case TicketCategory.EMERGENCY: return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || ticket.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'ALL' || ticket.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-healthcare-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error</h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
        <button
          onClick={loadTickets}
          className="mt-4 btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
          <p className="mt-2 text-gray-600">Manage your support requests and get help</p>
        </div>
        <Link to="/customer/support/new" className="btn-primary">
          <PlusIcon className="h-5 w-5 mr-2" />
          New Support Ticket
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TicketStatus | 'ALL')}
              className="input-field"
            >
              <option value="ALL">All Status</option>
              <option value={TicketStatus.OPEN}>Open</option>
              <option value={TicketStatus.IN_PROGRESS}>In Progress</option>
              <option value={TicketStatus.PENDING_CUSTOMER}>Pending Customer</option>
              <option value={TicketStatus.PENDING_INTERNAL}>Pending Internal</option>
              <option value={TicketStatus.RESOLVED}>Resolved</option>
              <option value={TicketStatus.CLOSED}>Closed</option>
              <option value={TicketStatus.CANCELLED}>Cancelled</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as TicketPriority | 'ALL')}
              className="input-field"
            >
              <option value="ALL">All Priority</option>
              <option value={TicketPriority.LOW}>Low</option>
              <option value={TicketPriority.MEDIUM}>Medium</option>
              <option value={TicketPriority.HIGH}>High</option>
              <option value={TicketPriority.URGENT}>Urgent</option>
              <option value={TicketPriority.CRITICAL}>Critical</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as TicketCategory | 'ALL')}
              className="input-field"
            >
              <option value="ALL">All Categories</option>
              <option value={TicketCategory.APPOINTMENT}>Appointment</option>
              <option value={TicketCategory.BILLING}>Billing</option>
              <option value={TicketCategory.MEDICAL_RECORDS}>Medical Records</option>
              <option value={TicketCategory.TECHNICAL}>Technical</option>
              <option value={TicketCategory.GENERAL_INQUIRY}>General Inquiry</option>
              <option value={TicketCategory.COMPLAINT}>Complaint</option>
              <option value={TicketCategory.FEEDBACK}>Feedback</option>
              <option value={TicketCategory.EMERGENCY}>Emergency</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="card">
        {filteredTickets.length > 0 ? (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
                        <span className="text-sm text-gray-500">#{ticket.ticketNumber}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(ticket.category)}`}>
                          {ticket.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          Created {formatDate(ticket.createdAt)}
                        </div>
                        {ticket.assignedTo && (
                          <div className="flex items-center">
                            <UserIcon className="h-4 w-4 mr-1" />
                            Assigned to {ticket.assignedTo.firstName} {ticket.assignedTo.lastName}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewTicket(ticket.id)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No support tickets found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'ALL' || priorityFilter !== 'ALL' || categoryFilter !== 'ALL'
                ? 'Try adjusting your filters or search terms.'
                : 'Get started by creating your first support ticket.'}
            </p>
            <div className="mt-6">
              <Link to="/customer/support/new" className="btn-primary">
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Support Ticket
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Ticket Detail Modal */}
      {showTicketModal && selectedTicket && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-xl bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedTicket.title}</h3>
                  <p className="text-sm text-gray-500">#{selectedTicket.ticketNumber}</p>
                </div>
                <button
                  onClick={() => {
                    setShowTicketModal(false);
                    setSelectedTicket(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Ticket Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                    <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedTicket.status)}`}>
                      {selectedTicket.status}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-gray-500">Priority</h4>
                    <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedTicket.priority)}`}>
                      {selectedTicket.priority}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-gray-500">Category</h4>
                    <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(selectedTicket.category)}`}>
                      {selectedTicket.category}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
                  <p className="text-gray-900">{selectedTicket.description}</p>
                </div>

                {/* Comments */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-4">Comments</h4>
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {selectedTicket.comments && selectedTicket.comments.length > 0 ? (
                      selectedTicket.comments.map((comment) => (
                        <div key={comment.id} className="border border-gray-200 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <UserIcon className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-900">
                                {comment.user.firstName} {comment.user.lastName}
                              </span>
                              {comment.isInternal && (
                                <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                                  Internal
                                </span>
                              )}
                            </div>
                            <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                          </div>
                          <p className="text-gray-700">{comment.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No comments yet</p>
                    )}
                  </div>
                </div>

                {/* Add Comment */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Add Comment</h4>
                  <div className="flex space-x-2">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Type your comment here..."
                      className="input-field flex-1 h-20 resize-none"
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim() || submittingComment}
                      className="btn-primary self-end"
                    >
                      {submittingComment ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <PaperAirplaneIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTicketManagement;
