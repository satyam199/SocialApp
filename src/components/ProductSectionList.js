import React from 'react';
import { View, Text, SectionList, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { loadNextPage } from '../redux/productsSlice';

export default function ProductSectionList() {
  const dispatch = useDispatch();
  const sections = useSelector(s => s.products.sections);
  const loading = useSelector(s => s.products.loading);
  const hasMore = useSelector(s => s.products.hasMore);

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id.toString()}
      renderSectionHeader={({ section }) => (
        <View style={{ backgroundColor: '#f2f2f2', padding: 8 }}>
          <Text style={{ fontWeight: 'bold' }}>{section.title}</Text>
        </View>
      )}
      renderItem={({ item }) => (
        <View style={{ padding: 12, borderBottomWidth: 0.4 }}>
          <Text>{item.title}</Text>
          <Text numberOfLines={1} style={{ color: '#666' }}>{item.description}</Text>
        </View>
      )}
      onEndReached={() => {
        if (!loading && hasMore) dispatch(loadNextPage());
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={() => (loading ? <ActivityIndicator style={{ margin: 16 }} /> : null)}
    />
  );
}
