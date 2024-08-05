import { useEffect, useState } from "react";
import '../../css/App.css'

const InputControl = () => {
    const [data, setData] = useState(null);
    const [frameNumber, setFrameNumber] = useState(0)
    const [frame, setFrame] = useState(null)
    
    const handleFrameChange = (e) => {
        setFrameNumber(e.target.value)
        setFrame(data[e.target.value])
        console.log(frame)
    }

    const getData = () => {
        fetch("./facial_data.json", {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            // Assuming data is an object with numeric keys
            setData(data);
            setFrame(data[frameNumber]);
          })
          .catch((e) => {
            console.log(e.message);
        });
    };
    
    useEffect(() => {
        getData()
        

    }, [])

    if (!data) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <div className="input-control">
            CONTROL HERE
            <button onClick={() => console.log(data)}>Click me</button>
            <input type="range"
                        min="0" max={data.frame_count - 1}
                        onChange={handleFrameChange} defaultValue={frameNumber}></input>{frameNumber}
            <div className="landmark-selection">
                {data && Object.entries(data.landmark_index).map(([index, value]) => (
                    <div>
                        <button className="landmark-button">{value}</button>
                        <button>
                            <span>X coord: {frame.landmarks[value][0]}</span>
                            <span>Y coord: {frame.landmarks[value][1]}</span>
                        </button>

                    </div>
                ))}
            </div>
        </div>
    );
}
 
export default InputControl;