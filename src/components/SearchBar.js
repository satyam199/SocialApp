import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { doSearch } from '../redux/productsSlice';
import debounce from 'lodash.debounce'; 

export default function SearchBar() {
  const dispatch = useDispatch();
  const [q, setQ] = useState('');


  const onChange = (text) => {0
    setQ(text);
    dispatch(doSearch(text));
  };

  return (
    <View style={{ padding: 8 }}>
      <TextInput
        placeholder="Search products"
        value={q}
        onChangeText={onChange}
        style={{ height: 40, borderRadius: 8, borderWidth: 1, paddingHorizontal: 8 }}
      />
    </View>
  );
}
