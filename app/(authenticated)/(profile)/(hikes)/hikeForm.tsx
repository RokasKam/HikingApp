import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { Dropdown } from 'react-native-paper-dropdown';
import { CustomInputField } from '@/components/InputField'; 
import {
  DifficultyLevelEnum,
  SeasonalityEnum,
  TerrainTypeEnum,
  AccessibilityEnum,
  HikeRequest,
} from '@/types/HikeRequest';
import { useHikes } from '@/context/HikeContext';
import { useLocalSearchParams } from 'expo-router';

  
const HikeForm: React.FC = () => {
  const [hike, setHike] = useState<HikeRequest>({
    name: '',
    description: '',
    difficultyLevel: DifficultyLevelEnum.Easy,
    totalDistance: 0,
    totalDurationInMinutes: 0,
    totalElevationGain: 0,
    seasonality: SeasonalityEnum.Spring,
    terrainType: TerrainTypeEnum.Forest,
    suitableForBeginners: true,
    accessibility: AccessibilityEnum.WheelchairFriendly,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [rawInputs, setRawInputs] = useState<{[key: string]: string}>({});

  const { postHike, updateHike } = useHikes();
  const params = useLocalSearchParams();
  const initialData = params.initialData ? JSON.parse(params.initialData as string) : null;
  const hikeId = params.hikeId as string | null;

  useEffect(() => {
    if (initialData) {
      setHike(initialData);
    }
  }, []);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!hike.name.trim()) newErrors.name = 'Name is required.';
    if (!hike.description.trim()) newErrors.description = 'Description is required.';
    if (hike.totalDistance < 0) newErrors.totalDistance = 'Total Distance must be greater than 0.';
    if (hike.totalDurationInMinutes < 0) newErrors.totalDurationInMinutes = 'Total Duration must be greater than 0.';
    if (hike.totalElevationGain < 0) newErrors.totalElevationGain = 'Elevation Gain cannot be negative.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      if (!hikeId) {
        postHike(hike);
      } else {
        updateHike(hike, hikeId!);
      }
    }
  };

  const handleInputChange = (field: keyof HikeRequest, value: any) => {
    setHike({ ...hike, [field]: value });
  };

  const handleDecimalInput = (field: keyof HikeRequest, value: string) => {
    setRawInputs(prev => ({ ...prev, [field]: value }));
  
    if (!value.trim()) {
      setHike({ ...hike, [field]: 0 });
      return;
    }
    
    const normalizedValue = value.replace(',', '.');
    const decimalRegex = /^-?\d*\.?\d*$/;
    
    if (decimalRegex.test(normalizedValue)) {
      const numValue = parseFloat(normalizedValue);
      if (!isNaN(numValue)) {
        setHike({ ...hike, [field]: numValue });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <CustomInputField
          label="Name"
          value={hike.name}
          onChangeText={(text: string) => handleInputChange('name', text)}
          errorMessage={errors.name}
        />

        <CustomInputField
          label="Description"
          value={hike.description}
          onChangeText={(text: string) => handleInputChange('description', text)}
          errorMessage={errors.description}
        />
        <View style={styles.dropdown}>
          <Dropdown
            label="Difficulty Level"
            value={hike.difficultyLevel}
            onSelect={(value) => handleInputChange('difficultyLevel', value)}
            options={Object.values(DifficultyLevelEnum).map((value) => ({ label: value, value }))}
            mode="outlined"
          />
        </View>
        <CustomInputField
          label="Total Distance (km)"
          value={rawInputs.totalDistance || (hike.totalDistance === 0 ? '' : hike.totalDistance.toString())}
          onChangeText={(text) => handleDecimalInput('totalDistance', text)}
          errorMessage={errors.totalDistance}
          keyboardType="decimal-pad"
          onBlur={() => setRawInputs(prev => ({ ...prev, totalDistance: hike.totalDistance.toString() }))}
        />

        <CustomInputField
          label="Total Duration (minutes)"
          value={rawInputs.totalDurationInMinutes || (hike.totalDurationInMinutes === 0 ? '' : hike.totalDurationInMinutes.toString())}
          onChangeText={(text) => handleDecimalInput('totalDurationInMinutes', text)}
          errorMessage={errors.totalDurationInMinutes}
          keyboardType="decimal-pad"
          onBlur={() => setRawInputs(prev => ({ ...prev, totalDurationInMinutes: hike.totalDurationInMinutes.toString() }))}
        />

        <CustomInputField
          label="Elevation Gain (m)"
          value={rawInputs.totalElevationGain || (hike.totalElevationGain === 0 ? '' : hike.totalElevationGain.toString())}
          onChangeText={(text) => handleDecimalInput('totalElevationGain', text)}
          errorMessage={errors.totalElevationGain}
          keyboardType="decimal-pad"
          onBlur={() => setRawInputs(prev => ({ ...prev, totalElevationGain: hike.totalElevationGain.toString() }))}
        />
       <View style={styles.dropdown}>
          <Dropdown
            label="Seasonality"
            value={hike.seasonality}
            onSelect={(value) => handleInputChange('seasonality', value)}
            options={Object.values(SeasonalityEnum).map((value) => ({ label: value, value }))}
            mode="outlined"
          />
        </View>
        <View style={styles.dropdown}>
          <Dropdown
            label="Terrain Type"
            value={hike.terrainType}
            onSelect={(value) => handleInputChange('terrainType', value)}
            options={Object.values(TerrainTypeEnum).map((value) => ({ label: value, value }))}
            mode="outlined"
          />
        </View>
        <View style={styles.dropdown}>
          <Dropdown
            label="Accessibility"
            value={hike.accessibility}
            onSelect={(value) => handleInputChange('accessibility', value)}
            options={Object.values(AccessibilityEnum).map((value) => ({ label: value, value }))}
            mode="outlined"
          />
        </View>
        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          Save Hike
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

export default HikeForm;
