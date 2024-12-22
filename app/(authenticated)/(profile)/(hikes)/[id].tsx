import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, ListRenderItem, TouchableOpacity, Alert } from 'react-native';
import { Card, Title, Text, Chip, ActivityIndicator, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useHikes } from '@/context/HikeContext';
import { Route } from '@/types/Route';
import { MaterialIcons } from '@expo/vector-icons'; 
import { HikeWithRoutes } from '@/types/HikeWithRoutes';

export default function HikeDetails() {
  const { id } = useLocalSearchParams();
  const { setHikeId, hikeWithRoutes, deleteHike, deleteRoute } = useHikes();
  const router = useRouter();

  useEffect(() => {
    setHikeId(id as string);
  }, [id]);

  const navigateToEditHikeForm = (hike: HikeWithRoutes) => {
    const { id, ...hikeRequest } = hike;
    router.navigate({ pathname: "/(authenticated)/(profile)/(hikes)/hikeForm", params: { 
      initialData: JSON.stringify(hikeRequest), 
      hikeId: id
    }});
  };

  const handleDelete = (hikeId: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this hike?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteHike(hikeId) },
      ],
      { cancelable: true }
    );
  };
  
  const navigateToEditRouteForm = (route: Route) => {
    const { id, ...routeRequest } = route;
    router.navigate({ pathname: "/(authenticated)/(profile)/(hikes)/(routes)/routeForm", params: { 
      initialData: JSON.stringify(routeRequest), 
      routeId: id
    }});
  };

  const handleRouteDelete = (routeId: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this route?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteRoute(routeId) },
      ],
      { cancelable: true }
    );
  };

  if (hikeWithRoutes.isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderRouteCard: ListRenderItem<Route> = ({ item }) => (
    <Card style={styles.routeCard} onPress={() => router.navigate(`/(profile)/(hikes)/(routes)/${item.id}`)} >
      <Card.Content>
        <View style={styles.routeHeader}>
          <Title>Route {item.orderInHike + 1}</Title>
          <View style={styles.actionIcons}>
            <TouchableOpacity onPress={() => navigateToEditRouteForm(item)}>
              <MaterialIcons name="edit" size={24} color="orange" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRouteDelete(item.id)}>
              <MaterialIcons name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
        </View>
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
      <View style={styles.hikeHeader}>
        <Title style={styles.title}>{hikeWithRoutes.data?.name}</Title>
        <View style={styles.actionIcons}>
          <TouchableOpacity onPress={() => navigateToEditHikeForm(hikeWithRoutes.data!)}>
            <MaterialIcons name="edit" size={24} color="orange" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(hikeWithRoutes.data?.id!)}>
            <MaterialIcons name="delete" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
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
      <Button
        mode="contained"
        onPress={() => router.navigate('/(profile)/(hikes)/(routes)/routeForm')}
        style={styles.createButton}
      >
        Add New Route
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
  createButton: {
    marginTop: 20,
  },
  hikeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionIcons: {
    flexDirection: 'row',
    gap: 15,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
