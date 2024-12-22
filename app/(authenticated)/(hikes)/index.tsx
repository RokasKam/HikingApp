import React, { useState } from 'react';
import { View, StyleSheet, FlatList, ListRenderItem, RefreshControl } from 'react-native';
import { ActivityIndicator, Card, Title, Text, Button, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useHikes } from '@/context/HikeContext';
import { Hike } from '@/types/Hike';

export default function Index() {
  const { hikes } = useHikes();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = () => {
    setIsRefreshing(true);
    try {
      hikes.refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  if (hikes.isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderHikeCard: ListRenderItem<Hike> = ({ item }) => (
    <Card
      style={styles.hikeCard}
      onPress={() => router.navigate(`/(hikes)/${item.id}`)} 
    >
      <Card.Content>
        <Title>{item.name}</Title>
        <Text>{item.description}</Text>
        <View style={styles.hikeDetails}>
          <Chip icon="terrain" style={styles.chip}>{item.difficultyLevel}</Chip>
          <Chip icon="map-marker-distance" style={styles.chip}>{item.totalDistance} km</Chip>
          <Chip icon="clock-outline" style={styles.chip}>{item.totalDurationInMinutes} min</Chip>
        </View>
        <Text>Elevation Gain: {item.totalElevationGain} m</Text>
        <Text>Season: {item.seasonality}</Text>
      </Card.Content>
    </Card>
  );
  

  return (
    <SafeAreaView style={styles.container}>

      <Title style={styles.hikesTitle}>Available Hikes</Title>
      <FlatList
        data={hikes.data}
        renderItem={renderHikeCard}
        keyExtractor={item => item.id}
        style={styles.hikeList}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      />

      <Button
        mode="contained"
        onPress={() => router.push('/(authenticated)/map')}
        style={styles.button}
      >
        Go to Map
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  card: {
    marginBottom: 20,
  },
  field: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
  hikesTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  hikeList: {
    flex: 1,
  },
  hikeCard: {
    marginBottom: 15,
  },
  hikeDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom: 10,
  },
  chip: {
    marginRight: 5,
    marginBottom: 5,
  },
});

