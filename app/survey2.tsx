import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ApplianceWithHours, useUserAnswers } from './context/UserAnswersContext';

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

export const defaultWattages: Record<string, number> = {
  fridge: 150,
  ac: 1500,
  water: 500,
  desktop_computer: 200,
  fan: 75,
  blender: 300,
  coffee_machine: 800,
  dishwasher: 1800,
  electric_kettle: 1500,
  toaster: 1000,
  electric_oven: 2000,
  tv: 100,
  led_bulb: 9,
  video_game_console: 120,
  laptop: 60,
  lcd_monitor: 30,
  printer: 50,
  band_saw: 750,
  electric_blanket: 100,
  hair_dryer: 1200,
  dehumidifier: 400,
  circular_saw: 1000,
};

export default function SurveyScreen2() {
  const router = useRouter();
  const {answers, setAnswers} =useUserAnswers();
  const appliances: ApplianceWithHours[] = answers.appliances || [];

  // State to track which appliance's wattage is currently being edited
  const [editingApplianceId, setEditingApplianceId] = useState<string | null>(null);
  // State to hold the temporary value while editing, before saving to context
  const [tempWattage, setTempWattage] = useState<string>('');

  // State to track which appliance's quantity is currently being edited
  const [editingApplianceQuantityId, setEditingApplianceQuantityId] = useState<string | null>(null);
  // State to hold the temporary quantity value while editing
  const [tempQuantity, setTempQuantity] = useState<string>('');

  // Effect to initialize tempWattage when editing mode starts
  useEffect(() => {
    if (editingApplianceId) {
      const appliance = appliances.find(a => a.id === editingApplianceId);
      if (appliance) {
        setTempWattage(String(appliance.wattage));
      }
    }
  }, [editingApplianceId, appliances]);

  // Effect to initialize tempQuantity when quantity editing mode starts
  useEffect(() => {
    if (editingApplianceQuantityId) {
      const appliance = appliances.find(a => a.id === editingApplianceQuantityId);
      if (appliance) {
        setTempQuantity(String(appliance.quantity));
      }
    }
  }, [editingApplianceQuantityId, appliances]);

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

  // New function to handle wattage changes and update context
  const handleWattageChange = (applianceId: string, newWattage: number) => {
    setAnswers((prevAnswers) => {
      const updatedAppliances = (prevAnswers.appliances || []).map((appliance) =>
        appliance.id === applianceId
          ? { ...appliance, wattage: newWattage } // 'wattage' property is now recognized
          : appliance
      );
      return { ...prevAnswers, appliances: updatedAppliances };
    });
  };

  const handleSaveWattage = (applianceId: string) => {
    const parsedWattage = parseFloat(tempWattage);
    if (!isNaN(parsedWattage)) {
      handleWattageChange(applianceId, parsedWattage);
    }
    setEditingApplianceId(null);
    setTempWattage('');
  };

  const handleCancelEdit = () => {
    setEditingApplianceId(null);
    setTempWattage('');
  };

  const handleQuantityChange = (applianceId: string, newQuantity: number) => {
    setAnswers((prevAnswers) => {
      const updatedAppliances = (prevAnswers.appliances || []).map((appliance) =>
        appliance.id === applianceId
          ? { ...appliance, quantity: newQuantity }
          : appliance
      );
      return { ...prevAnswers, appliances: updatedAppliances };
    });
  };

  const handleSaveQuantity = (applianceId: string) => {
    const parsedQuantity = parseInt(tempQuantity, 10);
    if (!isNaN(parsedQuantity) && parsedQuantity >= 0) { // Add validation for non-negative integers
      handleQuantityChange(applianceId, parsedQuantity);
    }
    setEditingApplianceQuantityId(null);
    setTempQuantity('');
  };

  const handleCancelQuantityEdit = () => {
    setEditingApplianceQuantityId(null);
    setTempQuantity('');
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

              {/* Wattage Display and Edit Section */}
              <View style={styles.wattageSection}>
                <Text style={styles.defaultWattageLabel}>
                  Default Wattage: {defaultWattages[item.id] || 0} W
                </Text>

                {editingApplianceId === item.id ? (
                  <View style={styles.editRow}>
                    <TextInput
                      style={styles.inputField}
                      keyboardType="numeric"
                      onChangeText={setTempWattage}
                      value={tempWattage}
                      placeholder="Enter wattage"
                      placeholderTextColor="#ccc"
                    />
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={() => handleSaveWattage(item.id)}
                    >
                      <Text style={styles.buttonTextSmall}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={handleCancelEdit}
                    >
                      <Text style={styles.buttonTextSmall}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.displayRow}>
                    <Text style={styles.currentValueText}>
                      Current Wattage: {item.wattage} W
                    </Text>
                    <TouchableOpacity
                      style={styles.changeButton}
                      onPress={() => setEditingApplianceId(item.id)}
                    >
                      <Text style={styles.buttonTextSmall}>Change Value</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              {/* End Wattage Section */}

              {/* Quantity Display and Edit Section (NEW) */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Quantity:</Text>
                {editingApplianceQuantityId === item.id ? (
                  <View style={styles.editRow}>
                    <TextInput
                      style={styles.inputField}
                      keyboardType="numeric"
                      onChangeText={setTempQuantity}
                      value={tempQuantity}
                      placeholder="Enter quantity"
                      placeholderTextColor="#ccc"
                    />
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={() => handleSaveQuantity(item.id)}
                    >
                      <Text style={styles.buttonTextSmall}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={handleCancelQuantityEdit}
                    >
                      <Text style={styles.buttonTextSmall}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.displayRow}>
                    <Text style={styles.currentValueText}>
                      Current: {item.quantity}
                    </Text>
                    <TouchableOpacity
                      style={styles.changeButton}
                      onPress={() => setEditingApplianceQuantityId(item.id)}
                    >
                      <Text style={styles.buttonTextSmall}>Change</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              {/* End Quantity Section */}

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
  itemTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  section: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',
    paddingTop: 10,
  },
  sectionLabel: {
    fontSize: 14,
    color: '#E0E0E0',
    marginBottom: 5,
  },
  itemValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  defaultWattageLabel: {
    fontSize: 14,
    color: '#E0E0E0',
    marginBottom: 5,
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
  wattageSection: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',
    paddingTop: 10,
  },
  currentValueText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  displayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputField: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
    marginRight: 10,
  },
  changeButton: {
    backgroundColor: '#FFD700', // Gold color
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#4CAF50', // Green
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 5, // Space between save and cancel
  },
  cancelButton: {
    backgroundColor: '#F44336', // Red
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonTextSmall: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
    itemText: {
    fontSize: 16,
    color: '#fff',
    marginVertical: 4,
  },
  
});
