import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { Dropdown } from 'react-native-paper-dropdown';
import { CustomInputField } from '@/components/InputField'; 
import { FeatureType, PointType, PointRequest } from '@/types/PointRequest';
import { useHikes } from '@/context/HikeContext';
import { useLocalSearchParams } from 'expo-router';

const PointForm: React.FC = () => {
  const { routeId, postPoint, updatePoint } = useHikes();
  const [point, setPoint] = useState<PointRequest>({
    latitude: 0,
    longitude: 0,
    altitude: 0,
    feature: FeatureType.Viewpoint,
    featureDescription: '',
    pointType: PointType.Startpoint,
    image: '',
    orderInRoute: 0,
    routeId: routeId!,
  });

  const params = useLocalSearchParams();
  const initialData = params.initialData ? JSON.parse(params.initialData as string) : null;
  const pointId = params.pointId as string | null;

  useEffect(() => {
    if (initialData) {
      setPoint(initialData);
    }
  }, []);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [rawInputs, setRawInputs] = useState<{[key: string]: string}>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!point.latitude) newErrors.latitude = 'Latitude is required.';
    if (!point.longitude) newErrors.longitude = 'Longitude is required.';
    if (!point.altitude) newErrors.altitude = 'Altitude is required.';
    if (!point.orderInRoute && point.orderInRoute !== 0) newErrors.orderInRoute = 'Order in Route is required.';
    if (!point.routeId) newErrors.routeId = 'Route ID is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      if (!pointId) {
        postPoint(point);
      } else {
        updatePoint(point, pointId!);
      }
    }
  };

  const handleInputChange = (field: keyof PointRequest, value: any) => {
    setPoint({ ...point, [field]: value });
  };

  const handleDecimalInput = (field: keyof PointRequest, value: string) => {
    setRawInputs(prev => ({ ...prev, [field]: value }));
  
    if (!value.trim()) {
      setPoint({ ...point, [field]: 0 });
      return;
    }
    
    const normalizedValue = value.replace(',', '.');
    const decimalRegex = /^-?\d*\.?\d*$/;
    
    if (decimalRegex.test(normalizedValue)) {
      const numValue = parseFloat(normalizedValue);
      if (!isNaN(numValue)) {
        setPoint({ ...point, [field]: numValue });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <CustomInputField
          label="Latitude"
          value={rawInputs.latitude || (point.latitude === 0 ? '' : point.latitude.toString())}
          onChangeText={(text) => handleDecimalInput('latitude', text)}
          errorMessage={errors.latitude}
          keyboardType="decimal-pad"
          onBlur={() => setRawInputs(prev => ({ ...prev, latitude: point.latitude.toString() }))}
        />

        <CustomInputField
          label="Longitude"
          value={rawInputs.longitude || (point.longitude === 0 ? '' : point.longitude.toString())}
          onChangeText={(text) => handleDecimalInput('longitude', text)}
          errorMessage={errors.longitude}
          keyboardType="decimal-pad"
          onBlur={() => setRawInputs(prev => ({ ...prev, longitude: point.longitude.toString() }))}
        />

        <CustomInputField
          label="Altitude (m)"
          value={rawInputs.altitude || (point.altitude === 0 ? '' : point.altitude.toString())}
          onChangeText={(text) => handleDecimalInput('altitude', text)}
          errorMessage={errors.altitude}
          keyboardType="decimal-pad"
          onBlur={() => setRawInputs(prev => ({ ...prev, altitude: point.altitude.toString() }))}
        />

        <CustomInputField
          label="Feature Description"
          value={point.featureDescription}
          onChangeText={(text) => handleInputChange('featureDescription', text)}
        />

        <CustomInputField
          label="Order in Route"
          value={point.orderInRoute === 0 ? '' : point.orderInRoute.toString()}
          onChangeText={(text) => handleInputChange('orderInRoute', isNaN(parseInt(text, 10)) ? 0 : parseInt(text, 10))}
          errorMessage={errors.orderInRoute}
          keyboardType="number-pad"
        />
        <View style={styles.dropdown}>
          <Dropdown
            label="Feature Type"
            value={point.feature}
            onSelect={(value) => handleInputChange('feature', value)}
            options={Object.values(FeatureType).map((value) => ({ label: value, value }))}
            mode="outlined"
          />
        </View>
        <View style={styles.dropdown}>
          <Dropdown
            label="Point Type"
            value={point.pointType}
            onSelect={(value) => handleInputChange('pointType', value)}
            options={Object.values(PointType).map((value) => ({ label: value, value }))}
            mode="outlined"
          />
        </View>
        <CustomInputField
          label="Image URL"
          value={point.image}
          onChangeText={(text) => handleInputChange('image', text)}
        />

        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          Save Point
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
  dropdown: {
    marginBottom: 16,
  },
  scrollContainer: {
    padding: 16,
  },
  button: {
    marginTop: 16,
  },
});

export default PointForm;
