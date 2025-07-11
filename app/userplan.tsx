import { useEffect, useState } from 'react';
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
// comment for github :D
    const { appliances, usage, area, location, installationLocation, shading, budget } = answers;


    // - Daily Load Calculations
    let totalDailyWattageHours = 0;
    if (appliances && appliances.length > 0) {
        totalDailyWattageHours = appliances.reduce((sum, appliance) => {
            const dailyWh = appliance.wattage * appliance.hours * appliance.quantity;
            return (sum + dailyWh) * 1.3;
        }, 0);

    
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

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Your Solar Plan</h2>

      <div className="mt-4">
        <p><strong>Total Daily Energy Usage:</strong> {totalDailyWattageHours.toFixed(2)} Wh</p>
        {psh !== null && <p><strong>Peak Sun Hours (min):</strong> {psh.toFixed(2)} hours/day</p>}
        {panelAmt !== null && <p><strong>Estimated Solar Panels Needed:</strong> {panelAmt}</p>}
      </div>
    </div>
  );
}


