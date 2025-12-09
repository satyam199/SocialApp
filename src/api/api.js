export const API = {
  getCategories: async () => {
    const res = await fetch('https://dummyjson.com/products/categories');
    return res.json();
  },

  getProducts: async ({ limit = 20, skip = 0 }) => {
    const res = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
    return res.json();
  },

  getProductsByCategory: async ({ category, limit = 20, skip = 0 }) => {
    const res = await fetch(`https://dummyjson.com/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`);
    return res.json();
  },
  
  searchProducts: async ({ q, limit = 20, skip = 0 }) => {
    const res = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`);
    return res.json();
  }
};
