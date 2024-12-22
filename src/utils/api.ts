const BASE_URL = 'https://www.palmtourism-uae.net/api';

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  console.log(`Fetching ${BASE_URL}${endpoint}`);
  
  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`API Response for ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error);
    throw error;
  }
};