 
export const requestMaker = async (url, method = 'GET', payload = null) => {
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      if (payload) {
        options.body = JSON.stringify(payload);
      }
  
      const response = await fetch(url, options);
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong!');
      }
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;  
    }
  };
  