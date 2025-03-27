import styles from './Home.module.css';
import CombinedGraph from '../weatherOutput/CombinedGraph';
import SeparatedGraphs from '../weatherOutput/SeparatedGraphs';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useState } from "react";
import UserPreferencesComponent from '../userPreferences/UserPreferencesComponent';


export default function Home({ graphMode }) {
    const { user } = useAuthContext()
    // This is a flag to be toggled when the user has updated their preferences
    const [preferencesUpdated, setPreferencesUpdated] = useState(false);

    const handlePreferencesUpdate = () => {
        setPreferencesUpdated((prev) => !prev);
    };

    return (
        <div className={styles.container}>
            <div className={styles.weatherForm}>
                {graphMode === "separated" ? (
                    <SeparatedGraphs preferencesUpdated={preferencesUpdated} />
                ) : (
                    <CombinedGraph preferencesUpdated={preferencesUpdated} />
                )}
            </div>
            <div className={styles.sidebar}>
                <UserPreferencesComponent uid={user.uid} onUpdate={handlePreferencesUpdate} />
            </div>
        </div>
    )
}