import api from './axios';

export const authApi = {
  login: (data: any) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
};

export const userApi = {
  getProfile: () => api.get('/users/me'),
  getAllUsers: (params?: any) => api.get('/users', { params }),
  updateUser: (id: number, data: any) => api.put(`/users/${id}`, data),
  deleteUser: (id: number) => api.delete(`/users/${id}`),
};

export const ticketApi = {
  createTicket: (data: any) => api.post('/tickets', data),
  getTicketById: (id: number) => api.get(`/tickets/${id}`),
  getAllTickets: (params?: any) => api.get('/tickets', { params }),
  getMyTickets: (params?: any) => api.get('/tickets/my', { params }),
  updateTicket: (id: number, data: any) => api.put(`/tickets/${id}`, data),
  getDashboardStats: () => api.get('/tickets/dashboard/stats'),
};

export const commentApi = {
  addComment: (ticketId: number, data: any) => api.post(`/tickets/${ticketId}/comments`, data),
  getComments: (ticketId: number) => api.get(`/tickets/${ticketId}/comments`),
};

export const attachmentApi = {
  uploadAttachment: (ticketId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/tickets/${ticketId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getAttachments: (ticketId: number) => api.get(`/tickets/${ticketId}/attachments`),
  getDownloadUrl: (ticketId: number, attachmentId: number) => 
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/tickets/${ticketId}/attachments/${attachmentId}/download`,
};

export const ratingApi = {
  rateTicket: (ticketId: number, data: any) => api.post(`/tickets/${ticketId}/rating`, data),
  getRating: (ticketId: number) => api.get(`/tickets/${ticketId}/rating`),
};
