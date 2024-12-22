import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, SafeAreaView, Modal, TouchableOpacity, Alert } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { Title, Chip, ActivityIndicator, Button } from 'react-native-paper';
import { useHikes } from '@/context/HikeContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Point } from '@/types/Point';
import { RouteWithPoints } from '@/types/RouteWithPoints';
import { useTheme } from 'react-native-paper';

MapboxGL.setAccessToken("");

export default function RouteDetails() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { setRouteId, routeWithPoints, deleteRoute, deletePoint } = useHikes();
    const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        setRouteId(id as string);
    }, [id]);

    const openModal = (point: Point) => {
        setSelectedPoint(point);
        setModalVisible(true);
    };

    const closeModal = () => {
        setSelectedPoint(null);
        setModalVisible(false);
    };

    if (routeWithPoints.isLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    const navigateToEditRouteForm = (route: RouteWithPoints) => {

        const { id, points, ...routeRequest } = route;
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

      const navigateToEditPointForm = (point: Point) => {
        closeModal();
        const { id, ...pointRequest } = point;
        router.navigate({ pathname: "/(authenticated)/(profile)/(hikes)/(routes)/(points)/pointForm", params: { 
          initialData: JSON.stringify(pointRequest), 
          pointId: id
        }});
      };
    
      const handlePointDelete = (pointId: string) => {
        Alert.alert(
          'Confirm Delete',
          'Are you sure you want to delete this point?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => {
                closeModal();
                deletePoint(pointId);
            }},
          ],
          { cancelable: true }
        );
      };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.detailsContainer}>
                <View style={styles.hikeHeader}>
                    <Title style={styles.title}>Route details</Title>
                    <View style={styles.actionIcons}>
                    <TouchableOpacity onPress={() => navigateToEditRouteForm(routeWithPoints.data!)}>
                        <MaterialIcons name="edit" size={24} color="orange" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleRouteDelete(routeWithPoints.data?.id!)}>
                        <MaterialIcons name="delete" size={24} color="red" />
                    </TouchableOpacity>
                    </View>
                </View>
                <Text>{routeWithPoints.data?.description}</Text>
                <View style={styles.chipContainer}>
                    <Chip icon="walk" style={styles.chip}>{routeWithPoints.data?.distance} km</Chip>
                    <Chip icon="clock" style={styles.chip}>{routeWithPoints.data?.durationInMinutes} min</Chip>
                    <Chip icon="elevation-rise" style={styles.chip}>Elevation: {routeWithPoints.data?.elevationChange} m</Chip>
                    <Chip icon="terrain" style={styles.chip}>{routeWithPoints.data?.terrainType}</Chip>
                    <Chip icon="road" style={styles.chip}>{routeWithPoints.data?.surfaceType}</Chip>
                </View>
            </View>
            <View style={styles.mapContainer}>
                <MapboxGL.MapView style={styles.map}>
                    {routeWithPoints.data?.points[0] !== undefined && (
                        <>
                            <MapboxGL.Camera
                                zoomLevel={5}
                                centerCoordinate={[
                                    routeWithPoints.data.points[0].longitude,
                                    routeWithPoints.data.points[0].latitude,
                                ]}
                            />
                            {routeWithPoints.data.points.map((point) => (
                                <MapboxGL.PointAnnotation
                                    key={point.id}
                                    id={point.id}
                                    coordinate={[point.longitude, point.latitude]}
                                    onSelected={() => openModal(point)}
                                >
                                    <FontAwesome name="map-pin" size={24} color="red" />
                                </MapboxGL.PointAnnotation>
                            ))}
                        </>
                    )}
                </MapboxGL.MapView>
            </View>
            {/* Modal for displaying point details */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
                        {selectedPoint && (
                            <>
                                <View style={styles.routeHeader}>
                                    <Title>Point {selectedPoint.orderInRoute + 1}</Title>
                                    <View style={styles.actionIcons}>
                                        <TouchableOpacity onPress={() => {navigateToEditPointForm(selectedPoint)}}>
                                            <MaterialIcons name="edit" size={24} color="orange" />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {handlePointDelete(selectedPoint.id)}}>
                                            <MaterialIcons name="delete" size={24} color="red" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <Text style={[styles.pointDetail, { color: theme.colors.onSurface }]}>Feature: {selectedPoint.feature}</Text>
                                <Text style={[styles.pointDetail, { color: theme.colors.onSurface }]}>Description: {selectedPoint.featureDescription}</Text>
                                <Text style={[styles.pointDetail, { color: theme.colors.onSurface }]}>Latitude: {selectedPoint.latitude}</Text>
                                <Text style={[styles.pointDetail, { color: theme.colors.onSurface }]}>Longitude: {selectedPoint.longitude}</Text>
                                <Text style={[styles.pointDetail, { color: theme.colors.onSurface }]}>Type: {selectedPoint.pointType}</Text>
                            </>
                        )}
                        <Button mode="contained" onPress={closeModal}>
                            Close
                        </Button>
                    </View>
                </View>
            </Modal>
            <Button
                mode="contained"
                onPress={() => router.navigate('/(profile)/(hikes)/(routes)/(points)/pointForm')}
                style={styles.createButton}
            >
                Add New Point
            </Button>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    mapContainer: {
        height: '60%',
        marginBottom: 20,
    },
    map: {
        flex: 1,
    },
    detailsContainer: {
        padding: 20,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    chip: {
        marginRight: 10,
        marginBottom: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    pointDetail: {
        marginBottom: 10,
        fontSize: 16,
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
    title: {
        fontSize: 24,
        marginBottom: 10,
    },
    routeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
});

