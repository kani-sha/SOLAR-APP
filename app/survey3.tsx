import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useUserAnswers } from './context/UserAnswersContext';

export default function SurveyScreen3() {
  const router = useRouter();
  const { setAnswers } = useUserAnswers();
  
  const [area, setArea] = useState<string>('');

  const [open, setOpen] = useState(false);
  const [installationLocation, setInstallationLocation] = useState(null);
  const [items, setItems] = useState([
    { label: 'Roof', value: 'roof' },
    { label: 'Ground', value: 'ground' },
  ]);

  const [open2, setOpen2] = useState(false);
  const [shading, setShading] = useState(null);
  const [items2, setItems2] = useState([
    { label: 'No Shade', value: 'noshade' },
    { label: 'Partially Shaded', value: 'someshade' },
    { label: 'Mostly Shaded', value: 'mostshade' },
  ]);

  // Function to handle saving data to context and navigating
  const handleNext = () => {
    // Parse area to a number, default to null if invalid
    const parsedArea = parseFloat(area);
    const finalArea = isNaN(parsedArea) ? null : parsedArea;

    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      area: finalArea,
      installationLocation: installationLocation,
      shading: shading,
    }));

    router.push("/survey4"); // Navigate to the next screen
  };

  return (
    <View style={styles.container}>
     <View style={styles.formArea}>
      <Text style={styles.text}>How much space do you have?</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your area in (m^2)"
        placeholderTextColor="#ccc"
        keyboardType='numeric'
        value={area}
        onChangeText={setArea}
      />

      <Text style={styles.subText}>Where are you planning to install?</Text>          
      <DropDownPicker
        open={open}
        value={installationLocation}
        items={items}
        setOpen={setOpen}
        setValue={setInstallationLocation}
        setItems={setItems}
        placeholder="Select a location"
        containerStyle={{ width: '100%', marginTop: 20, zIndex: 2000 }}
        style={{ backgroundColor: '#fff', borderColor: '#ccc' }}
        dropDownContainerStyle={{ backgroundColor: '#fff' }}
        textStyle={{ fontSize: 16 }}
      />

      <Text style={[styles.subText, {marginTop: 90}]}>Any shading?</Text>
      <DropDownPicker
        open={open2}
        value={shading}
        items={items2}
        setOpen={setOpen2}
        setValue={setShading}
        setItems={setItems2}
        placeholder="Select shading"
        containerStyle={{ width: '100%', marginTop: 20, zIndex: 1000 }}
        style={{ backgroundColor: '#fff', borderColor: '#ccc' }}
        dropDownContainerStyle={{ backgroundColor: '#fff' }}
        textStyle={{ fontSize: 16 }}  
      />
      </View>



      <TouchableOpacity
              style={styles.button}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>

    </View>
  );
}

  const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 300,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5A88C9",
  },
  formArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
  },
  text: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: -70,
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: "#fff",
    marginTop: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#fff',
    backgroundColor: '#3c6fc8',
    borderRadius: 8,
    marginTop: 10,
  },
  button: {
    bottom: 50,
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 10,
  },
  buttonText: {
    color: "#f0a500",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
});
