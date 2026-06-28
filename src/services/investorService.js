import axiosInstance from '../api/axiosInstance';
import { ENDPOINTS } from '../api/endpoints';

export const investorService = {
  /**
   * Fetch paginated investors list with search, filters, and sorting
   */
  async getInvestors(params = {}) {
    const queryParams = new URLSearchParams();

    if (params.search) queryParams.set('search', params.search);
    if (params.industry) queryParams.set('industry', params.industry);
    if (params.stage) queryParams.set('stage', params.stage);
    if (params.location) queryParams.set('location', params.location);
    if (params.page) queryParams.set('page', params.page);
    if (params.limit) queryParams.set('limit', params.limit);
    if (params.sort) queryParams.set('sort', params.sort);

    const queryString = queryParams.toString();
    const url = queryString
      ? `${ENDPOINTS.INVESTORS}?${queryString}`
      : ENDPOINTS.INVESTORS;

    const { data } = await axiosInstance.get(url);
    return data;
  },

  /**
   * Fetch single investor by ID
   */
  async getInvestorById(id) {
    const { data } = await axiosInstance.get(ENDPOINTS.INVESTOR_BY_ID(id));
    return data;
  },

  /**
   * Create or update investor profile
   */
  async upsertInvestorProfile(profileData) {
    const { data } = await axiosInstance.post(ENDPOINTS.INVESTORS, profileData);
    return data;
  }
};
