import { createContext, useContext, useState } from "react";

type Answers = {
  appliances: string[];
  usage?: Record<string, number>;
};

type ContextType = {
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
};

const UserAnswersContext = createContext<ContextType | undefined>(undefined);

export const UserAnswersProvider = ({ children }: { children: React.ReactNode }) => {
  const [answers, setAnswers] = useState<Answers>({
    appliances: [],
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