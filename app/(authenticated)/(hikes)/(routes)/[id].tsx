import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, SafeAreaView, Modal, TouchableOpacity } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { Title, Chip, ActivityIndicator, Button } from 'react-native-paper';
import { useHikes } from '@/context/HikeContext';
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Point } from '@/types/Point';
import { useTheme } from 'react-native-paper';

MapboxGL.setAccessToken("");

export default function RouteDetails() {
    const { id } = useLocalSearchParams();
    const { setRouteId, routeWithPoints } = useHikes();
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

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.detailsContainer}>
                <Title>Route Details</Title>
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
                    <MapboxGL.Camera
                        zoomLevel={5}
                        centerCoordinate={
                            routeWithPoints.data?.points[0]
                            ? [routeWithPoints.data.points[0].longitude, routeWithPoints.data.points[0].latitude]
                            : [23.9036, 54.8985] // Lithuania center coordinates
                        }
                    />
                    {routeWithPoints.data?.points.map((point) => (
                        <MapboxGL.PointAnnotation
                            key={point.id}
                            id={point.id}
                            coordinate={[point.longitude, point.latitude]}
                            onSelected={() => openModal(point)}
                        >
                            <FontAwesome name="map-pin" size={24} color="red" />
                        </MapboxGL.PointAnnotation>
                    ))}
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
                        <Title>Point Details</Title>
                        {selectedPoint && (
                            <>
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    mapContainer: {
        height: '80%',
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
});
