import { createContext, useContext, useState } from "react";

// This context will hold the user's answers throughout the app
export interface ApplianceWithHours {
  id: string;
  name: string;           
  hours: number;
  wattage: number;
  quantity: number;
}

// Define the structure of the answers object
type Answers = {
  appliances: ApplianceWithHours[];
  usage?: Record<string, number>;
  area?: number | null;
  installationLocation?: 'roof' | 'ground' | null;
  shading?: 'noshade' | 'someshade' | 'mostshade' | null;
  location?: {
    longitude: number,
    latitude: number
  };
  budget?: number;
};

// Define the context type
type ContextType = {
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
};
const UserAnswersContext = createContext<ContextType | undefined>(undefined);

// Create a provider component to wrap the app and provide the context
export const UserAnswersProvider = ({ children }: { children: React.ReactNode }) => {
  const [answers, setAnswers] = useState<Answers>({
    appliances: [],
    usage: {},
    area: null,
    installationLocation: null,
    shading: null,
    location: undefined,
    budget: undefined,
  });

  // Initialize the context value
  return (
    <UserAnswersContext.Provider value={{ answers, setAnswers }}>
      {children}
    </UserAnswersContext.Provider>
  );
};

// Custom hook to use the UserAnswersContext, allowing components to access the answers and setAnswers function easily
export const useUserAnswers = () => {
  const context = useContext(UserAnswersContext);
  if (!context) {
    throw new Error("useUserAnswers must be used within a UserAnswersProvider");
  }
  return context;
};