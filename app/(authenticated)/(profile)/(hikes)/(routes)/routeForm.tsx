import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { Dropdown } from 'react-native-paper-dropdown';
import { CustomInputField } from '@/components/InputField'; 
import { TerrainTypeEnum, SurfaceTypeEnum, RouteRequest } from '@/types/RouteRequest';
import { useHikes } from '@/context/HikeContext';
import { useLocalSearchParams } from 'expo-router';

const RouteForm: React.FC = () => {
  const {hikeId, postRoute, updateRoute} = useHikes();
  const [route, setRoute] = useState<RouteRequest>({
    orderInHike: 0,
    description: '',
    distance: 0,
    durationInMinutes: 0,
    elevationChange: 0,
    navigationNotes: '',
    terrainType: TerrainTypeEnum.Forest,
    surfaceType: SurfaceTypeEnum.Grass,
    hikeId: hikeId!,
  });

  const params = useLocalSearchParams();
  const initialData = params.initialData ? JSON.parse(params.initialData as string) : null;
  const routeId = params.routeId as string | null;

  const [rawInputs, setRawInputs] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (initialData) {
      setRoute(initialData);
    }
  }, []);
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!route.description.trim()) newErrors.description = 'Description is required.';
    if (route.distance < 0) newErrors.distance = 'Distance must be greater than 0.';
    if (route.durationInMinutes < 0) newErrors.durationInMinutes = 'Duration must be greater than 0.';
    if (!route.navigationNotes.trim()) newErrors.navigationNotes = 'Navigation notes are required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      if (!routeId) {
        postRoute(route);
      } else {
        updateRoute(route, routeId!);
      }
    }
  };
  const handleDecimalInput = (field: keyof RouteRequest, value: string) => {
    setRawInputs(prev => ({ ...prev, [field]: value }));
  
    if (!value.trim()) {
      setRoute({ ...route, [field]: 0 });
      return;
    }
    
    const normalizedValue = value.replace(',', '.');
    const decimalRegex = /^-?\d*\.?\d*$/;
    
    if (decimalRegex.test(normalizedValue)) {
      const numValue = parseFloat(normalizedValue);
      if (!isNaN(numValue)) {
        setRoute({ ...route, [field]: numValue });
      }
    }
  };

  const handleInputChange = (field: keyof RouteRequest, value: any) => {
    setRoute({ ...route, [field]: value });
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <CustomInputField
          label="Order in Hike"
          value={route.orderInHike === 0 ? '' : route.orderInHike.toString()}
          onChangeText={(text) => handleInputChange('orderInHike', isNaN(parseInt(text, 10)) ? 0 : parseInt(text, 10))}
          errorMessage={errors.orderInHike}
          keyboardType="number-pad"
        />

        <CustomInputField
          label="Description"
          value={route.description}
          onChangeText={(text) => handleInputChange('description', text)}
          errorMessage={errors.description}
        />

        <CustomInputField
          label="Distance (km)"
          value={rawInputs.distance || (route.distance === 0 ? '' : route.distance.toString())}
          onChangeText={(text) => handleDecimalInput('distance', text)}
          errorMessage={errors.distance}
          keyboardType="decimal-pad"
          onBlur={() => setRawInputs(prev => ({ ...prev, distance: route.distance.toString() }))}
        />

        <CustomInputField
          label="Duration (minutes)"
          value={rawInputs.durationInMinutes || (route.durationInMinutes === 0 ? '' : route.durationInMinutes.toString())}
          onChangeText={(text) => handleDecimalInput('durationInMinutes', text)}
          errorMessage={errors.durationInMinutes}
          keyboardType="decimal-pad"
          onBlur={() => setRawInputs(prev => ({ ...prev, durationInMinutes: route.durationInMinutes.toString() }))}
        />      

        <CustomInputField
          label="Elevation Gain (m)"
          value={rawInputs.elevationChange || (route.elevationChange === 0 ? '' : route.elevationChange.toString())}
          onChangeText={(text) => handleDecimalInput('elevationChange', text)}
          errorMessage={errors.elevationChange}
          keyboardType="decimal-pad"
          onBlur={() => setRawInputs(prev => ({ ...prev, elevationChange: route.elevationChange.toString() }))}
        />

        <CustomInputField
          label="Navigation Notes"
          value={route.navigationNotes}
          onChangeText={(text) => handleInputChange('navigationNotes', text)}
          errorMessage={errors.navigationNotes}
        />
        <View style={styles.dropdown}>
            <Dropdown
            label="Terrain Type"
            value={route.terrainType}
            onSelect={(value) => handleInputChange('terrainType', value)}
            options={Object.values(TerrainTypeEnum).map((value) => ({ label: value, value }))}
            mode="outlined"
            />
        </View>
        <View style={styles.dropdown}>
            <Dropdown
            label="Surface Type"
            value={route.surfaceType}
            onSelect={(value) => handleInputChange('surfaceType', value)}
            options={Object.values(SurfaceTypeEnum).map((value) => ({ label: value, value }))}
            mode="outlined"
            />
        </View>
        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          Save Route
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    padding: 16,
  },
  dropdown: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
});

export default RouteForm;
