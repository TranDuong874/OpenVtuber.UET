import { createContext, useReducer, useState } from "react";

export const ModelContext = createContext();

const ModelProvider = ({children}) => {
    const [modelObject, setModelObject] = useState(null)

    return (
        <ModelContext.Provider value={{modelObject, setModelObject}}>
            {children}
        </ModelContext.Provider>
    );
}
 
export default ModelProvider;