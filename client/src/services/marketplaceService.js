const request = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(response.status === 404 ? 'not-found' : 'request-failed');
  return response.json();
};

export const getProducts = ({ category = 'all', search = '' } = {}) => request(`/api/products?category=${encodeURIComponent(category)}&search=${encodeURIComponent(search)}`);
export const getProductById = (id) => request(`/api/products/${encodeURIComponent(id)}`);
export const getCategories = () => request('/api/categories');
