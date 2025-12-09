import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { chooseCategory } from '../redux/productsSlice';

export default function CategoryDropdown() {
  const dispatch = useDispatch();
  const categories = useSelector(s => s.products.categories || []);
  const selected = useSelector(s => s.products.selectedCategory);

  return (
    <View style={{ height: 50 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            onPress={() => dispatch(chooseCategory(cat))}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              margin: 8,
              borderRadius: 16,
              backgroundColor: cat === selected ? '#007AFF' : '#EEE'
            }}
          >
            <Text style={{ color: cat === selected ? '#FFF' : '#000' }}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}