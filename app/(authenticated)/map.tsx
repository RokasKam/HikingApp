import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Mapbox from '@rnmapbox/maps';

Mapbox.setAccessToken("");

export default function Map() {

  const handlePress = (feature: GeoJSON.Feature) => {
    const geometry = feature.geometry;

    // Check if the geometry type is 'Point'
    if (geometry.type === 'Point') {
        console.log('Coords:', geometry);
    } else {
        console.log('Geometry type is not Point:', geometry.type);
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Mapbox.MapView style={styles.map} onPress={handlePress} />
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
    page: {
      flex: 1,
  
      justifyContent: 'center',
  
      alignItems: 'center',
    },
  
    container: {
      height: 300,
  
      width: 300,
    },
  
    map: {
      flex: 1,
    },
  });