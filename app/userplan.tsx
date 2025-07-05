import { useUserAnswers } from './context/UserAnswersContext';

export default function UserPlanScreen() {
const { answers } = useUserAnswers();

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

    // - Solar Panel Sizing

    // - Battery Amount
    
    // - Tilt Angle


    // - Cost Estimation

}
