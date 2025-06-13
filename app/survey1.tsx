import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useUserAnswers } from "./context/UserAnswersContext";

interface ApplianceWithHours {
  id: string; 
  hours: number; 
}

export default function SurveyScreen() {
const router = useRouter();

  const [open, setOpen] = useState(false);
  const [selectedAppliances, setSelectedAppliances] = useState<string[]>([]);
  const { setAnswers } = useUserAnswers();
  const [items, setItems] = useState([
    { label: "Refrigerator", value: "fridge" },
    { label: "Air Conditioner", value: "ac" },
    { label: "Water Dispenser", value: "water" },
    { label: "Desktop Computer", value: "desktop_computer" },
    { label: "Fan", value: "fan" },
    { label: "Blender", value: "blender" },
    { label: "Coffee Machine", value: "coffee_machine" },
    { label: "Dishwasher", value: "dishwasher" },
    { label: "Electric Kettle", value: "electric_kettle" },
    { label: "Toaster", value: "toaster" },
    { label: "Electric Oven", value: "electric_oven" },
    { label: "TV", value: "tv" },
    { label: "LED Bulb", value: "led_bulb" },
    { label: "Video Game Console", value: "video_game_console" },
    { label: "Laptop", value: "laptop" },
    { label: "LCD Monitor", value: "lcd_monitor" },
    { label: "Printer", value: "printer" },
    { label: "Band Saw", value: "band_saw" },
    { label: "Electric Blanket", value: "electric_blanket" },
    { label: "Hair Dryer", value: "hair_dryer" },
    { label: "Dehumidifier", value: "dehumidifier" },
    { label: "Circular Saw", value: "circular_saw" }
  ]);

  // Function to handle moving to the next screen and saving selected appliances to context
  const handleNext = () => {
    // Transform selected string IDs into objects with default hours
    const appliancesWithDefaultHours: ApplianceWithHours[] = selectedAppliances.map(id => ({
      id: id,
      hours: 0, // Initialize hours to 0
    }));

    // Update the context with the new structure
    setAnswers((prev) => ({ ...prev, appliances: appliancesWithDefaultHours }));

    router.push("/survey2");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>What appliance(s) will you be installing?</Text>
    
    <View style= {{ marginTop: 20, zIndex: 1000, elevation: 1000 }}>
    <DropDownPicker
        multiple={true}
        min={0}
        max={10}
        mode="BADGE"
        open={open}
        value={selectedAppliances}
        items={items}
        setOpen={setOpen}
        setValue={setSelectedAppliances}
        setItems={setItems}
        placeholder="Select an appliance"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
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
  dropdown: {
    height: 40,
    width: 300,
    alignSelf: "center",
    backgroundColor: "#fafafa",
    borderColor: "#ccc",
  },
  dropdownContainer: {
    width: 300,
    alignSelf: "center",
    backgroundColor: "#fafafa",
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
