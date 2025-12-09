import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../api/api';

const CACHE_KEY = '@cached_first10_products';


const initialState = {
  categories: ['ALL'],
  selectedCategory: 'ALL',
  searchQuery: '',
  sections: [],        
  allProducts: [],   
  seenIds: new Set(),      
  pageIndex: 0,
  loading: false,
  hasMore: true,
  cachedLoaded: false,
};


const SET_CATEGORIES = 'SET_CATEGORIES';
const SET_SELECTED_CATEGORY = 'SET_SELECTED_CATEGORY';
const SET_SEARCH_QUERY = 'SET_SEARCH_QUERY';
const ADD_PRODUCTS = 'ADD_PRODUCTS';
const RESET_PRODUCTS = 'RESET_PRODUCTS';
const SET_LOADING = 'SET_LOADING';
const INCREMENT_PAGE = 'INCREMENT_PAGE';
const SET_HAS_MORE = 'SET_HAS_MORE';
const SET_CACHED_LOADED = 'SET_CACHED_LOADED';


export default function reducer(state = initialState, action) {
  switch(action.type) {
    case SET_CATEGORIES:
      return { ...state, categories: ['ALL', ...action.payload] };
    case SET_SELECTED_CATEGORY:
      return { ...state, selectedCategory: action.payload, pageIndex: 0, hasMore: true };
    case SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload, pageIndex: 0, hasMore: true };
    case RESET_PRODUCTS:
      return { ...state, allProducts: [], sections: [], seenIds: new Set(), pageIndex: 0, hasMore: true };
    case ADD_PRODUCTS: {
      
      const incoming = action.payload || [];
      const newSeen = new Set([...state.seenIds]);
      const uniqueAdd = incoming.filter(p => {
        if (!p || newSeen.has(p.id)) return false;
        newSeen.add(p.id);
        return true;
      });
      const merged = [...state.allProducts, ...uniqueAdd];
      
      const groups = {};
      for (const p of merged) {
        const cat = p.category || 'Uncategorized';
        groups[cat] = groups[cat] || [];
        groups[cat].push(p);
      }
      const sections = Object.keys(groups).map(k => ({ title: k, data: groups[k] }));
      return {
        ...state,
        allProducts: merged,
        sections,
        seenIds: newSeen,
      };
    }
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case INCREMENT_PAGE:
      return { ...state, pageIndex: state.pageIndex + 1 };
    case SET_HAS_MORE:
      return { ...state, hasMore: action.payload };
    case SET_CACHED_LOADED:
      return { ...state, cachedLoaded: true };
    default:
      return state;
  }
}


export const setCategories = (cats) => ({ type: SET_CATEGORIES, payload: cats });
export const setSelectedCategory = (cat) => ({ type: SET_SELECTED_CATEGORY, payload: cat });
export const setSearchQuery = (q) => ({ type: SET_SEARCH_QUERY, payload: q });
export const resetProducts = () => ({ type: RESET_PRODUCTS });
export const addProducts = (products) => ({ type: ADD_PRODUCTS, payload: products });
export const setLoading = (val) => ({ type: SET_LOADING, payload: val });
export const incrementPage = () => ({ type: INCREMENT_PAGE });
export const setHasMore = (val) => ({ type: SET_HAS_MORE, payload: val });
export const setCachedLoaded = () => ({ type: SET_CACHED_LOADED });


export const fetchCategories = () => async dispatch => {
  try {
    const cats = await API.getCategories();
    dispatch(setCategories(cats || []));
  } catch (e) {
    console.warn('fetchCategories', e);
  }
};

function skipForPage(pageIndex) {
  return pageIndex * 9;
}


export const fetchProducts = ({ append = true } = {}) => async (dispatch, getState) => {
  const { products } = getState();
  if (!products.hasMore && append) return;
  dispatch(setLoading(true));
  try {
    const pageIndex = products.pageIndex;
    const skip = skipForPage(pageIndex);
    const limit = 20;
    const selectedCategory = products.selectedCategory;
    const q = products.searchQuery?.trim();
    let resp;

    if (q && q.length > 0) {
      resp = await API.searchProducts({ q, limit, skip });
    } else if (selectedCategory && selectedCategory !== 'ALL') {
      resp = await API.getProductsByCategory({ category: selectedCategory, limit, skip });
    } else {
      resp = await API.getProducts({ limit, skip });
    }

    const items = resp?.products || [];
    if (!append) dispatch(resetProducts());
    dispatch(addProducts(items));
    const hasMore = (resp?.total || items.length) > (skip + items.length);
    dispatch(setHasMore(hasMore));
    if (pageIndex === 0) {
      const first10 = items.slice(0, 10);
      try {
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(first10));
      } catch (e) {
        console.warn('cache save failed', e);
      }
    }
    dispatch(setLoading(false));
  } catch (err) {
    console.warn('fetchProducts error', err);
    dispatch(setLoading(false));
  }
};

export const loadCache = () => async dispatch => {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        dispatch({ type: ADD_PRODUCTS, payload: parsed });
      }
    }
  } catch (e) {
    console.warn('cache read fail', e);
  }
  dispatch(setCachedLoaded());
};

export const chooseCategory = (category) => async dispatch => {
  dispatch(setSelectedCategory(category));
  dispatch(resetProducts());
  await dispatch(fetchProducts({ append: false }));
};

export const doSearch = (query) => async dispatch => {
  dispatch(setSearchQuery(query));
  dispatch(setSelectedCategory('ALL'));
  dispatch(resetProducts());
  await dispatch(fetchProducts({ append: false }));
};

export const loadNextPage = () => async (dispatch, getState) => {
  const { products } = getState();
  if (products.loading || !products.hasMore) return;
  dispatch(incrementPage());
  await dispatch(fetchProducts({ append: true }));
};
