import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { View, SafeAreaView } from 'react-native';
import store from './redux/store';
import CategoryDropdown from './components/CategoryDropdown';
import SearchBar from './components/SearchBar';
import ProductSectionList from './components/ProductSectionList';
import { fetchCategories, loadCache, fetchProducts } from './redux/productsSlice';

function Main() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadCache());
    dispatch(fetchCategories());
    dispatch(fetchProducts({ append: false }));
  }, [dispatch]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CategoryDropdown />
      <SearchBar />
      <View style={{ flex: 1 }}>
        <ProductSectionList />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}