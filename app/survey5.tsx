import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SurveyScreen2() {
  const [budget, setBudget] = useState(5000);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Finally, what's your budget?</Text>

      <Slider
        style={{ width: '100%', height: 40 }}
        minimumValue={1000}
        maximumValue={20000}
        step={500}
        minimumTrackTintColor="#f0a500"
        maximumTrackTintColor="#ccc"
        thumbTintColor="#fff"
        value={budget}
        onValueChange={setBudget}
      />

      <Text style={styles.value}>${budget.toLocaleString()}</Text>

      <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/survey4")}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>See My Plan!</Text>
      </TouchableOpacity>

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
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },  
  text: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
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