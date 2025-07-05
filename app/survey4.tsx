import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUserAnswers } from './context/UserAnswersContext';


export default function SurveyScreen4() {  
  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [permissionRequested, setPermissionRequested] = useState(false);
  
  const handleGetLocation = async () => {
  setPermissionRequested(true);
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    setErrorMsg('Permission to access location was denied');
    return;
  }

  let loc = await Location.getCurrentPositionAsync({});
  setLocation(loc);
};


  return (
    <View style={styles.container}>
      <Text style={styles.text}>Where are you located?</Text>

      {!permissionRequested ? (
      <TouchableOpacity
        style={styles.button}
        onPress={handleGetLocation}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Allow Location Access</Text>
      </TouchableOpacity>
    ) : (
      <>
        <Text style={styles.text}>Your Location:</Text>
        <Text style={styles.text}>
          {errorMsg
            ? errorMsg
            : location
            ? `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`
            : 'Waiting for location...'}
        </Text>   
    


      <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/survey5")}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
      </>)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5A88C9",
  },
  text: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    marginTop: 300,
    position: "absolute",
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