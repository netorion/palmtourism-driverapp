const BASE_URL = 'https://www.palmtourism-uae.net/api';

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  // Remove leading slash to prevent double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  console.log(`Fetching ${BASE_URL}/${cleanEndpoint}`);
  
  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  };

  try {
    const response = await fetch(`${BASE_URL}/${cleanEndpoint}`, {
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
    console.log(`API Response for ${cleanEndpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`API Error for ${cleanEndpoint}:`, error);
    throw error;
  }
};