import { createContext, useContext, useState } from "react";
const ExercisesContext = createContext();

export function ExercisesProvider({ children }) {
    const [exercises, setExercises] = useState([]);
    return (
        <ExercisesContext.Provider value={{ exercises, setExercises }}>
            {children}
        </ExercisesContext.Provider>
    );
}

export function useExercises() {
    return useContext(ExercisesContext);
}