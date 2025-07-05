import { createContext, useContext, useState } from "react";

export interface ApplianceWithHours {
  id: string; 
  hours: number; 
  wattage: number;
}

type Answers = {
  appliances: ApplianceWithHours[];
  usage?: Record<string, number>;
  area?: number | null; // For the area input (can be null if not entered)
  installationLocation?: 'roof' | 'ground' | null; // For the first dropdown
  shading?: 'noshade' | 'someshade' | 'mostshade' | null; // For the second dropdown
  location?: {
    longitude: number, 
    latitude: number
  }; 
  budget?: number; 
};

type ContextType = {
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
};

const UserAnswersContext = createContext<ContextType | undefined>(undefined);

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

  return (
    <UserAnswersContext.Provider value={{ answers, setAnswers }}>
      {children}
    </UserAnswersContext.Provider>
  );
};

export const useUserAnswers = () => {
  const context = useContext(UserAnswersContext);
  if (!context) {
    throw new Error("useUserAnswers must be used within a UserAnswersProvider");
  }
  return context;
};