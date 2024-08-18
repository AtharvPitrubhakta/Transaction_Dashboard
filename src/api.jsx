import axios from 'axios';

// Update this with your actual backend URL
const API_BASE_URL = 'https://trasaction.onrender.com/api/products'; 

// Fetch transactions with month, search query, and pagination
export const getTransactions = async (month, search = '', page = 1, perPage = 10) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/getCombinedData`, {
      month,
      search,
      page,
      perPage,
    });

    
    if (response.status === 200) {
      return response;
    } else {
      throw new Error(`Failed to fetch transactions: ${response.statusText}`);
    }
    
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    throw error; 
  }
};
