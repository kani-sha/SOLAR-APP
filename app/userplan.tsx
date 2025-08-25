import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useUserAnswers } from './context/UserAnswersContext';


export default function UserPlanScreen() {
  const { answers } = useUserAnswers();

  //const { appliances, location } = answers;

  const [psh, setPsh] = useState<number>(5.0); // Peak Sun Hours - hardcoded for now
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

interface NasaPowerResponse {
    properties: {
      parameter: {
        ALLSKY_KWH_M2_DAY: Record<string, number>;
      };
    };
  }

function getDateString(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

async function fetchAvgPSH(lat: number, lon: number): Promise<number> {
  const end = getDateString(1);   // yesterday
  const start = getDateString(30); // 30 days ago

  const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=ALLSKY_KWH_M2_DAY&community=RE&longitude=${lon}&latitude=${lat}&start=${start}&end=${end}&format=JSON`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`NASA POWER API request failed: ${response.statusText}`);
  }

  const data = (await response.json()) as NasaPowerResponse;
  const values = Object.values(data.properties.parameter.ALLSKY_KWH_M2_DAY);

  if (values.length === 0) throw new Error("No PSH data returned");

  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  return avg;
}

  useEffect(() => {
    async function updatePSH() {
      if (!location?.latitude || !location?.longitude) return;

      try {
        const avgPSH = await fetchAvgPSH(location.latitude, location.longitude);
        setPsh(avgPSH);
        console.log("Stored 30-day avg PSH:", avgPSH);
      } catch (error) {
        console.error("Error fetching PSH:", error);
      }
    }

    updatePSH();
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
          <Text style={styles.boldText}>Avg Peak Sun Hours:</Text> {psh !== null ? psh.toFixed(2) : "N/A"} hours/day
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
