import axiosInstance from '../api/axiosInstance';

const BASE = '/shortlist';

export const shortlistService = {
  /**
   * Get all shortlisted investors for the current user
   */
  async getShortlist(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.set('search', params.search);
    if (params.industry) queryParams.set('industry', params.industry);
    if (params.stage) queryParams.set('stage', params.stage);
    if (params.location) queryParams.set('location', params.location);
    if (params.sort) queryParams.set('sort', params.sort);

    const queryString = queryParams.toString();
    const url = queryString ? `${BASE}?${queryString}` : BASE;
    const { data } = await axiosInstance.get(url);
    return data;
  },

  /**
   * Get shortlist count (for badge)
   */
  async getShortlistCount() {
    const { data } = await axiosInstance.get(`${BASE}/count`);
    return data;
  },

  /**
   * Add an investor to the shortlist
   */
  async addToShortlist(investorId) {
    const { data } = await axiosInstance.post(`${BASE}/${investorId}`);
    return data;
  },

  /**
   * Remove an investor from the shortlist
   */
  async removeFromShortlist(investorId) {
    const { data } = await axiosInstance.delete(`${BASE}/${investorId}`);
    return data;
  }
};
