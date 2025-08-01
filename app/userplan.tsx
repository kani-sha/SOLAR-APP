import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useUserAnswers } from './context/UserAnswersContext';

export default function UserPlanScreen() {
const { answers } = useUserAnswers();

//const { appliances, location } = answers;

const [psh, setPsh] = useState<number | null>(null); // Peak Sun Hours
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
            const dailyWh = appliance.wattage * appliance.hours * appliance.quantity;
            return (sum + dailyWh);
        }, 0) * 1.3;

    
    }

    // - Fetch solar radiation data
    useEffect(() => {
  async function fetchSolarData() {
    if (!location) return;

    try {
      const { latitude, longitude } = location;
      const apiKey = import.meta.env.VITE_SOLAR_API_KEY;

      const response = await fetch(
        `https://developer.nrel.gov/api/solar/solar_resource/v1.json?api_key=${apiKey}&lat=${latitude}&lon=${longitude}`
      );

      const data = await response.json();

      // Extract annual average solar radiation (kWh/m²/day)
      const psh = data?.outputs?.avg_dni?.annual;

      if (psh && typeof psh === "number") {
        setPsh(psh);
      } else {
        console.error("Invalid solar data:", data);
      }
    } catch (error) {
      console.error("Error fetching solar data:", error);
    }



  }

  fetchSolarData();
}, [location]);


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

  return (
  <View style={styles.container}> {/* Assuming a View component from React Native or a similar styled div in React */}

    {/* Display the title for the solar plan */}
    <Text style={styles.title}>Your Solar Plan</Text>

    {/* Section to display the calculated solar plan details */}
    <View style={styles.detailsContainer}>
      <Text style={styles.detailText}>
        <Text style={styles.boldText}>Total Daily Energy Usage:</Text> {totalDailyWattageHours.toFixed(2)} Wh
      </Text>
      {psh !== null && (
        <Text style={styles.detailText}>
          <Text style={styles.boldText}>Peak Sun Hours (min):</Text> {psh.toFixed(2)} hours/day
        </Text>
      )}
      {panelAmt !== null && (
        <Text style={styles.detailText}>
          <Text style={styles.boldText}>Estimated Solar Panels Needed:</Text> {panelAmt}
        </Text>
      )}
      {batteryAmt !== null && (
        <Text style={styles.detailText}>
          <Text style={styles.boldText}>Estimated Batteries Needed:</Text> {batteryAmt}
        </Text>
      )}
      {totalCost > 0 && (
        <Text style={styles.detailText}>
          <Text style={styles.boldText}>Estimated System Cost:</Text> ${totalCost.toFixed(2)}
        </Text>
      )}
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





