import React, { useState } from 'react';
import { StyleSheet, View, ListRenderItem, FlatList, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Title, Text, Button, useTheme, ActivityIndicator, Card, Chip } from 'react-native-paper';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from 'expo-router';
import { useHikes } from '@/context/HikeContext';
import { Hike } from '@/types/Hike';
import { MaterialIcons } from '@expo/vector-icons';

const Index = () => {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const { userHikes, deleteHike } = useHikes();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  if (isLoading || !user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const onRefresh = () => {
    setIsRefreshing(true);
    try {
        userHikes.refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  if (userHikes.isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  
  const navigateToEditHikeForm = (hike: Hike) => {
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
  

  const renderHikeCard: ListRenderItem<Hike> = ({ item }) => (
    <Card
      style={styles.hikeCard}
      onPress={() => router.navigate(`/(profile)/(hikes)/${item.id}`)} 
    >
      <Card.Content>
        <View style={styles.hikeHeader}>
          <Title>{item.name}</Title>
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={() => navigateToEditHikeForm(item)}>
                <MaterialIcons name="edit" size={24} color="orange" />
            </TouchableOpacity>
            {user.role === 'Admin' && (
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <MaterialIcons name="delete" size={24} color="red" />
              </TouchableOpacity>
            )}
          </View>
        </View>
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
        <View style={styles.header}>
          <Avatar.Text size={80} label={user.userName.substring(0, 2).toUpperCase()} />
          <Title style={styles.userName}>{user.userName}</Title>
        </View>

        <Button
          mode="contained"
          onPress={logout}
          style={styles.logoutButton}
          labelStyle={styles.buttonLabel}
        >
          Logout
        </Button>
        {user.role !== 'Hiker' && (
            <>
                <Title style={styles.hikesTitle}>Available Hikes</Title>
                <FlatList
                    data={userHikes.data}
                    renderItem={renderHikeCard}
                    keyExtractor={item => item.id}
                    style={styles.hikeList}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
                    }
                />
                <Button
                    mode="contained"
                    onPress={() => {router.navigate(`/(profile)/(hikes)/hikeForm`)}}
                    style={styles.logoutButton}
                    labelStyle={styles.buttonLabel}
                >
                    Create new hike
                </Button>
            </>
        )}
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  logoutButton: {
    marginTop: 20,
  },
  buttonLabel: {
    fontSize: 16,
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
  hikeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: 'orange',
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
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
