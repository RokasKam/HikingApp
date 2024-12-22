import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, ListRenderItem } from 'react-native';
import { Card, Title, Text, Chip, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useHikes } from '@/context/HikeContext';
import { Route } from '@/types/Route';

export default function HikeDetails() {
    const { id } = useLocalSearchParams();
    const { setHikeId, hikeWithRoutes } = useHikes();
    const router = useRouter();
  
    useEffect(() => {
      setHikeId(id as string);
    }, [id]);

    if (hikeWithRoutes.isLoading) {
      return (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

  const renderRouteCard: ListRenderItem<Route> = ({ item }) => (
    <Card style={styles.routeCard} onPress={() => router.navigate(`/(hikes)/(routes)/${item.id}`)} >
      <Card.Content>
        <Title>Route {item.orderInHike + 1}</Title>
        <Text>{item.description}</Text>
        <Chip icon="map-marker-distance" style={styles.chip}>{item.distance} km</Chip>
        <Chip icon="clock-outline" style={styles.chip}>{item.durationInMinutes} min</Chip>
        <Text>Elevation Change: {item.elevationChange} m</Text>
        <Text>Terrain: {item.terrainType}</Text>
        <Text>Surface: {item.surfaceType}</Text>
        <Text>Navigation Notes: {item.navigationNotes}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Title style={styles.title}>{hikeWithRoutes.data?.name}</Title>
      <Text>{hikeWithRoutes.data?.description}</Text>
      <View style={styles.details}>
        <Chip icon="terrain" style={styles.chip}>{hikeWithRoutes.data?.difficultyLevel}</Chip>
        <Chip icon="map-marker-distance" style={styles.chip}>{hikeWithRoutes.data?.totalDistance} km</Chip>
        <Chip icon="clock-outline" style={styles.chip}>{hikeWithRoutes.data?.totalDurationInMinutes} min</Chip>
        <Chip icon="elevation-rise" style={styles.chip}>{hikeWithRoutes.data?.totalElevationGain} m</Chip>
        <Chip icon="weather-sunny" style={styles.chip}>{hikeWithRoutes.data?.seasonality}</Chip>
        <Chip icon="alert-rhombus" style={styles.chip}>
          {hikeWithRoutes.data?.suitableForBeginners ? 'Beginner Friendly' : 'Advanced'}
        </Chip>
      </View>
      <Title style={styles.routesTitle}>Routes</Title>
      <FlatList
        data={hikeWithRoutes.data?.routes}
        renderItem={renderRouteCard}
        keyExtractor={(route) => route.id}
        style={styles.routeList}
      />
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
    marginBottom: 10,
  },
  details: {
    marginBottom: 20,
  },
  chip: {
    marginRight: 5,
    marginBottom: 5,
  },
  routesTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  routeCard: {
    marginBottom: 15,
  },
  routeList: {
    flex: 1,
  },
});
