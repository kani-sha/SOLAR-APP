import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUserAnswers } from './context/UserAnswersContext';

interface ApplianceWithHours {
  id: string; // The value from your dropdown items
  hours: number; // The daily usage hours
}

const applianceLabels: Record<string, string> = {
  fridge: "Refrigerator",
  ac: "Air Conditioner",
  water: "Water Dispenser",
  desktop_computer: "Desktop Computer",
  fan: "Fan",
  blender: "Blender",
  coffee_machine: "Coffee Machine",
  dishwasher: "Dishwasher",
  electric_kettle: "Electric Kettle",
  toaster: "Toaster",
  electric_oven: "Electric Oven",
  tv: "TV",
  led_bulb: "LED Bulb",
  video_game_console: "Video Game Console",
  laptop: "Laptop",
  lcd_monitor: "LCD Monitor",
  printer: "Printer",
  band_saw: "Band Saw",
  electric_blanket: "Electric Blanket",
  hair_dryer: "Hair Dryer",
  dehumidifier: "Dehumidifier",
  circular_saw: "Circular Saw",
};

export default function SurveyScreen2() {
  const router = useRouter();
  const {answers, setAnswers} =useUserAnswers();
  const appliances: ApplianceWithHours[] = answers.appliances || [];

  // Function to update the hours for a specific appliance in context
  const handleHoursChange = (applianceId: string, newHours: number) => {
    setAnswers((prevAnswers) => {
      // 1. Create a NEW array by mapping over the previous appliances from context
      const updatedAppliances = (prevAnswers.appliances || []).map((appliance) =>
        // 2. If the current appliance matches the one we're changing
        appliance.id === applianceId
          ? // 3. Return a NEW object for this appliance, but with the updated hours
            { ...appliance, hours: newHours }
          : // 4. Otherwise, return the appliance object as is (no change)
            appliance
      );
      // 5. Return the new answers object with the updated appliances array
      return { ...prevAnswers, appliances: updatedAppliances };
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>How long will you use your appliance(s) day to day?</Text>

      {appliances.length > 0 ? (
        <FlatList
          data={appliances}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.applianceItemContainer}>
              <Text style={styles.itemText}>
                {/* Access item.id for the label lookup and item.hours for display */}
                {applianceLabels[item.id] || item.id}: {Math.round(item.hours)} hours/day
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={24}
                step={1}
                value={item.hours}
                onValueChange={(value) => handleHoursChange(item.id, value)}
                minimumTrackTintColor="#FFD700"
                maximumTrackTintColor="#A9A9A9"
                thumbTintColor="#FFFFFF"
              />
            </View>
          )}
          style={styles.flatList}
          contentContainerStyle={styles.flatListContent}
        /> 
      ) : (
        <Text style={styles.itemText}>No appliances selected.</Text>
      )}

      <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/survey3")}
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
    paddingTop: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5A88C9",
  },
  text: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  flatList: {
    width: '100%',
    flexGrow: 1,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  applianceItemContainer: {
    backgroundColor: '#6B9DD8',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
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
    itemText: {
    fontSize: 16,
    color: '#fff',
    marginVertical: 4,
  },
    slider: {
    width: '100%',
    height: 40,
  },
});
