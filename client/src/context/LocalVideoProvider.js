import { createContext, useState } from "react";

export const LocalVideoContext = createContext();

const LocalVideoProvider = ({children}) => {
    const [videoFrame, setVideoFrame] = useState(0);
    const [localVideoUrl, setLocalVideoUrl] = useState(null);

    return (
        <LocalVideoContext.Provider value={{videoFrame, setVideoFrame, localVideoUrl, setLocalVideoUrl}}>
            {children}
        </LocalVideoContext.Provider>
    );
}

export default LocalVideoProvider;