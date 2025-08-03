import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useUserAnswers } from './context/UserAnswersContext';

export default function UserPlanScreen() {
  const { answers } = useUserAnswers();
  const { appliances, usage, area, location, installationLocation, shading, budget } = answers;

  // Constants
  const DAYS_OF_AUTONOMY = 2; // How many days you want power without sunlight
  const DEPTH_OF_DISCHARGE = 0.6; // 60% usable battery capacity
  const SYSTEM_VOLTAGE = 12; // Standard DC system voltage
  const UNIT_BATTERY_AH = 100; // 100Ah battery

  const PANEL_COST = 250;
  const BATTERY_COST = 200;
  const CONTROLLER_COST = 30;
  const LABOR_COST = 20;

  const hardcodedPsh = 4.4; // Hardcoded for testing, normally fetched from API
  const [psh, setPsh] = useState<number>(hardcodedPsh);
  const [panelAmt, setPanelAmt] = useState<number | null>(null);
  const [batteryAmt, setBatteryAmt] = useState<number | null>(null);

  // Calculate total daily energy consumption in Wh
  let totalDailyWattageHours = 0;
  if (appliances && appliances.length > 0) {
    totalDailyWattageHours = appliances.reduce((sum, appliance) => {
      const dailyWh = appliance.wattage * appliance.hours * appliance.quantity;
      return sum + dailyWh;
    }, 0) * 1.3; // add 30% buffer
  }

  // Optional API call to get PSH from coordinates
  /*
  useEffect(() => {
    async function fetchSolarIrradiance() {
      try {
        const response = await fetch(`https://developer.nrel.gov/api/pvwatts/v6.json?api_key=DEMO_KEY&lat=${location.latitude}&lon=${location.longitude}&system_capacity=1&azimuth=180&tilt=${tilt}&array_type=1&module_type=1&losses=10`);
        const data = await response.json();
        const avgDaily = data.outputs.solrad_annual / 365;
        setPsh(avgDaily);
      } catch (error) {
        console.error('Error fetching PSH data:', error);
      }
    }
    if (location?.latitude && location?.longitude) fetchSolarIrradiance();
  }, [location]);
  */

  // useEffect to estimate solar panel amount needed based on totalDailyWattageHours and PSH
  useEffect(() => {
    if (psh > 0 && totalDailyWattageHours > 0) {
      const arrayConsumption = totalDailyWattageHours / (0.85 * psh); // in Wh
      const panelPower = 400; // W
      const panelAmt = Math.ceil(arrayConsumption / panelPower);
      setPanelAmt(panelAmt);
    }
  }, [psh, totalDailyWattageHours]);

  // useEffect to estimate battery amount needed based on totalDailyWattageHours
  useEffect(() => {
    if (totalDailyWattageHours > 0) {
      const totalBatteryStorage = totalDailyWattageHours * DAYS_OF_AUTONOMY;
      const batteryCapacityNeeded = totalBatteryStorage / DEPTH_OF_DISCHARGE;
      const unitBatteryCapacity = batteryCapacityNeeded / SYSTEM_VOLTAGE;
      const batteryAmt = Math.ceil(unitBatteryCapacity / UNIT_BATTERY_AH);
      setBatteryAmt(batteryAmt);
    }
  }, [totalDailyWattageHours]);

  // Determine panel tilt angle based on location
  const tilt = location && 'latitude' in location ? (location as any).latitude : 0;

  // Total system cost estimate
  const totalCost =
    (panelAmt ?? 0) * PANEL_COST +
    (batteryAmt ?? 0) * BATTERY_COST +
    CONTROLLER_COST +
    LABOR_COST;

  // Debug console logging
  console.log('totalDailyWattageHours:', totalDailyWattageHours);
  console.log('psh:', psh);
  console.log('panelAmt:', panelAmt);
  console.log('batteryAmt:', batteryAmt);
  console.log('totalCost:', totalCost);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Solar Plan</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>
          <Text style={styles.boldText}>Total Daily Energy Usage:</Text>{' '}
          {totalDailyWattageHours.toFixed(2)} Wh
        </Text>
        {psh !== null && (
          <Text style={styles.detailText}>
            <Text style={styles.boldText}>Peak Sun Hours (min):</Text>{' '}
            {psh.toFixed(2)} hours/day
          </Text>
        )}
        {panelAmt !== null && (
          <Text style={styles.detailText}>
            <Text style={styles.boldText}>Estimated Solar Panels Needed:</Text>{' '}
            {panelAmt}
          </Text>
        )}
        {batteryAmt !== null && (
          <Text style={styles.detailText}>
            <Text style={styles.boldText}>Estimated Batteries Needed:</Text>{' '}
            {batteryAmt}
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5A88C9',
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
