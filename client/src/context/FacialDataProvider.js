import { createContext, useReducer, useState } from "react";

export const FacialDataContext = createContext();

const FacialDataProvider = ({children}) => {
    const [facialData, setFacialData] = useState(null)

    return (
        <FacialDataContext.Provider value={{facialData, setFacialData}}>
            {children}
        </FacialDataContext.Provider>
    );
}
 
export default FacialDataProvider;