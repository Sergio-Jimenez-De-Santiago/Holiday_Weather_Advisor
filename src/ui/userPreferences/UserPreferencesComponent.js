import { useEffect, useState, useRef } from "react";
import { useFirestore } from "../../hooks/useFirestore"

export default function UserPreferencesComponent({ uid, onUpdate }) {
    const [highTemp, setHighTemp] = useState('')
    const [lowTemp, setLowTemp] = useState('')
    const [windy, setWindy] = useState('')
    const [notWindy, setNotWindy] = useState('')
    const [rainy, setRainy] = useState('')
    const [notRainy, setNotRainy] = useState('')
    const { updateDocument, response } = useFirestore('preferences')
    const hasUpdatedRef = useRef(false);

    const handleSubmit = (e) => {
        e.preventDefault()

        const preferences = {
            uid, 
            highTemp: highTemp || "27",
            lowTemp: lowTemp || "0",
            windy: windy || "25",
            notWindy: notWindy || "8",
            rainy: rainy || "3",
            notRainy: notRainy || "1.5"
        };

        updateDocument(preferences);

        setHighTemp('');
        setLowTemp('');
        setWindy('');
        setNotWindy('');
        setRainy('');
        setNotRainy('');

        hasUpdatedRef.current = false;
    }

    useEffect(() => {
        console.log("UserPreferences useEffect:", response.success, hasUpdatedRef.current);
        if(response.success && !hasUpdatedRef.current){
            if (onUpdate) onUpdate();
            hasUpdatedRef.current = true;
        }
    }, [response.success, onUpdate])

    return (
        <>
            <h3>Update Preferences</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>High temperature threshold (default is 27°C):</span>
                    <input
                        type="text"
                        onChange={(e) => setHighTemp(e.target.value)}
                        value={highTemp}
                    />
                </label>
                <label>
                    <span>Low temperature threshold (default is 0°C)::</span>
                    <input
                        type="number"
                        onChange={(e) => setLowTemp(e.target.value)}
                        value={lowTemp}
                    />
                </label>
                <label>
                    <span>Windy day threshold (default is 25km/h):</span>
                    <input
                        type="text"
                        onChange={(e) => setWindy(e.target.value)}
                        value={windy}
                    />
                </label>
                <label>
                    <span>Not windy day threshold (default is 8km/h):</span>
                    <input
                        type="text"
                        onChange={(e) => setNotWindy(e.target.value)}
                        value={notWindy}
                    />
                </label>
                <label>
                    <span>Rainy day threshold (default is 3mm):</span>
                    <input
                        type="text"
                        onChange={(e) => setRainy(e.target.value)}
                        value={rainy}
                    />
                </label>
                <label>
                    <span>Not rainy day threshold (default is 1.5mm):</span>
                    <input
                        type="text"
                        onChange={(e) => setNotRainy(e.target.value)}
                        value={notRainy}
                    />
                </label>
                <button>Update</button>
            </form>
        </>
    )
}
