export const logApiRequest = (method: string, url: string, data?: any) => {
  console.group(`🌐 API ${method} ${url}`);
  console.log('📤 Request:', data || 'No body');
  console.groupEnd();
};

export const logApiResponse = (method: string, url: string, data: any) => {
  console.group(`✅ API ${method} ${url} - Success`);
  console.log('📥 Response:', data);
  console.groupEnd();
};

export const logApiError = (method: string, url: string, error: any) => {
  console.group(`❌ API ${method} ${url} - Error`);
  console.error('Error:', error);
  if (error.response) {
    console.error('Status:', error.response.status);
    console.error('Data:', error.response.data);
  }
  console.groupEnd();
};
