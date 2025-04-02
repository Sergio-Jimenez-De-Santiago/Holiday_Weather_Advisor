import { useEffect, useState, useRef } from "react";
import { useFirestore } from "../../hooks/useFirestore"
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';

export default function UserPreferencesComponent({ uid, onUpdate }) {
    const [highTemp, setHighTemp] = useState('')
    const [lowTemp, setLowTemp] = useState('')
    const [windy, setWindy] = useState('')
    const [notWindy, setNotWindy] = useState('')
    const [rainy, setRainy] = useState('')
    const [notRainy, setNotRainy] = useState('')
    const { updateDocument, response } = useFirestore('preferences')
    const hasUpdatedRef = useRef(false);

    const { user } = useAuthContext()
    const queryUid = !user ? "" : user.uid;
    const { documents } = useCollection(
            'preferences',
            ["uid", "==", queryUid]
        )

    const handleSubmit = (e) => {
        e.preventDefault()

        const preferences = {
            uid, 
            highTemp: highTemp !== '' ? highTemp : (documents?.[0]?.highTemp || "27"),
            lowTemp: lowTemp !== '' ? lowTemp : (documents?.[0]?.lowTemp || "0"),
            windy: windy !== '' ? windy : (documents?.[0]?.windy || "25"),
            notWindy: notWindy !== '' ? notWindy : (documents?.[0]?.notWindy || "8"),
            rainy: rainy !== '' ? rainy : (documents?.[0]?.rainy || "3"),
            notRainy: notRainy !== '' ? notRainy : (documents?.[0]?.notRainy || "1.5"),
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
                        placeholder={documents?.[0]?.highTemp || "27"}
                    />
                </label>
                <label>
                    <span>Low temperature threshold (default is 0°C)::</span>
                    <input
                        type="text"
                        onChange={(e) => setLowTemp(e.target.value)}
                        value={lowTemp}
                        placeholder={documents?.[0]?.lowTemp || "0"}
                    />
                </label>
                <label>
                    <span>Windy day threshold (default is 25km/h):</span>
                    <input
                        type="text"
                        onChange={(e) => setWindy(e.target.value)}
                        value={windy}
                        placeholder={documents?.[0]?.windy || "25"}
                    />
                </label>
                <label>
                    <span>Not windy day threshold (default is 8km/h):</span>
                    <input
                        type="text"
                        onChange={(e) => setNotWindy(e.target.value)}
                        value={notWindy}
                        placeholder={documents?.[0]?.notWindy || "8"}
                    />
                </label>
                <label>
                    <span>Rainy day threshold (default is 3mm):</span>
                    <input
                        type="text"
                        onChange={(e) => setRainy(e.target.value)}
                        value={rainy}
                        placeholder={documents?.[0]?.rainy || "3"}
                    />
                </label>
                <label>
                    <span>Not rainy day threshold (default is 1.5mm):</span>
                    <input
                        type="text"
                        onChange={(e) => setNotRainy(e.target.value)}
                        value={notRainy}
                        placeholder={documents?.[0]?.notRainy || "1.5"}
                    />
                </label>
                <button>Update</button>
            </form>
        </>
    )
}
