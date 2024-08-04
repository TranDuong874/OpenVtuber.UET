import { useEffect, useState } from "react";

const InputControl = () => {
    const [data, setData] = useState(null);

    const getData = () => {
        fetch('./facial_data.json',
            {
                headers : {
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json'
                }
            }
        )
        .then(
            response => setData(response)
        )
        .catch((e) => {
            console.log(e.message)
        })
    }
    useEffect(() => {
        getData()
    }, [])

    return (
        <div className="input-control">
            CONTROL HERE
            <button onClick={() => console.log(data)}>Click me</button>
        </div>
    );
}
 
export default InputControl;