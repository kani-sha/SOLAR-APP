import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useUserAnswers } from './context/UserAnswersContext';

export default function UserPlanScreen() {
  const { answers } = useUserAnswers();

  //const { appliances, location } = answers;

  const [psh, setPsh] = useState<number>(4.4); // Peak Sun Hours - hardcoded for now
  const [panelAmt, setPanelAmt] = useState<number | null>(null);
  const [batteryAmt, setBatteryAmt] = useState<number | null>(null);

  // Constants for gel batteries
  const DAYS_OF_AUTONOMY = 2;
  const DEPTH_OF_DISCHARGE = 0.6;
  const SYSTEM_VOLTAGE = 12;
  const UNIT_BATTERY_AH = 100;

  // -- Calculations -- //
  const { appliances, usage, area, location, installationLocation, shading, budget } = answers;

  // - Daily Load Calculations
  let totalDailyWattageHours = 0;
  if (appliances && appliances.length > 0) {
    totalDailyWattageHours = appliances.reduce((sum, appliance) => {
      const wattage = appliance.wattage ?? 0;
      const hours = appliance.hours ?? 0;
      const quantity = appliance.quantity ?? 0;
      const dailyWh = wattage * hours * quantity;
      return sum + dailyWh;
    }, 0) * 1.3;
  }

  // - Fetch solar radiation data (Optional, currently hardcoded)
  // useEffect(() => {
  //   async function fetchSolarData() {
  //     if (!location) return;
  //     try {
  //       const { latitude, longitude } = location;
  //       const apiKey = import.meta.env.VITE_SOLAR_API_KEY;

  //       const response = await fetch(
  //         `https://developer.nrel.gov/api/solar/solar_resource/v1.json?api_key=${apiKey}&lat=${latitude}&lon=${longitude}`
  //       );

  //       const data = await response.json();

  //       // Extract annual average solar radiation (kWh/m²/day)
  //       const psh = data?.outputs?.avg_dni?.annual;

  //       if (psh && typeof psh === "number") {
  //         setPsh(psh);
  //       } else {
  //         console.error("Invalid solar data:", data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching solar data:", error);
  //     }
  //   }
  //   fetchSolarData();
  // }, [location]);

  // - Solar Panel Sizing
  useEffect(() => {
    if (psh && totalDailyWattageHours > 0) {
      const arrayConsumption = totalDailyWattageHours / (0.85 * psh); // in Wh
      const panelPower = 400; // W
      const panelAmt = Math.ceil(arrayConsumption / panelPower);
      setPanelAmt(panelAmt);
    }
  }, [psh, totalDailyWattageHours]);

  // - Battery Amount Calculation
  useEffect(() => {
    if (totalDailyWattageHours > 0) {
      const totalBatteryStorage = totalDailyWattageHours * DAYS_OF_AUTONOMY;
      const batteryCapacityNeeded = totalBatteryStorage / DEPTH_OF_DISCHARGE;
      const unitBatteryCapacity = batteryCapacityNeeded / SYSTEM_VOLTAGE;
      const batteryAmt = Math.ceil(unitBatteryCapacity / UNIT_BATTERY_AH);
      setBatteryAmt(batteryAmt);
    }
  }, [totalDailyWattageHours]);

  // - Tilt Angle
  const tilt = location && 'latitude' in location ? (location as any).latitude : 0;

  // - Cost Estimation
  const PANEL_COST = 250;
  const BATTERY_COST = 200;
  const CONTROLLER_COST = 30;
  const LABOR_COST = 20;

  const totalCost = (panelAmt ?? 0) * PANEL_COST +
                    (batteryAmt ?? 0) * BATTERY_COST +
                    CONTROLLER_COST + LABOR_COST;

  console.log("totalDailyWattageHours:", totalDailyWattageHours);
  console.log("psh:", psh);
  console.log("panelAmt:", panelAmt);
  console.log("batteryAmt:", batteryAmt);
  console.log("totalCost:", totalCost);

  //const loadProfile = appliances?.map(app => `${app.quantity} ${app.name} (${app.hours}h)`).join(", ") ?? "N/A";
  const loadProfile = appliances?.map(app => {
    const name = app.name ?? "Appliance";
    const quantity = app.quantity ?? 0;
    const hours = app.hours ?? 0;
    return `${quantity} ${name} (${hours}h)`;
  }).join(", ") ?? "N/A";

  return (
    <View style={styles.container}>
      {/* Display the title for the solar plan */}
      <Text style={styles.title}>Your Solar Plan</Text>

      {/* Section to display the calculated solar plan details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>
          <Text style={styles.boldText}>Recommended System:</Text> Off-Grid Solar System
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.boldText}>Total Daily Energy Usage:</Text> {totalDailyWattageHours.toFixed(2)} Wh
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.boldText}>Peak Sun Hours (min):</Text> {psh !== null ? psh.toFixed(2) : "N/A"} hours/day
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.boldText}>Estimated Solar Panels Needed:</Text> {panelAmt !== null ? `${panelAmt} × 400W (Tilt: ${tilt} degrees)` : "N/A"}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.boldText}>Estimated Batteries Needed:</Text> {batteryAmt !== null ? `${batteryAmt} × 12V 100Ah (Gel-Battery)` : "N/A"}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.boldText}>System Voltage:</Text> {SYSTEM_VOLTAGE}V DC
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.boldText}>Estimated System Cost:</Text> ${totalCost.toFixed(2)}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.boldText}>Load Profile:</Text> {loadProfile}
        </Text>
      </View>
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailsContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
});
