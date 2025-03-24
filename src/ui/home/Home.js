import styles from './Home.module.css';
import CombinedGraphRefactored from '../weatherOutput/CombinedGraphRefactored';
import SeparatedGraphsRefactored from '../weatherOutput/SeparatedGraphsRefactored';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useState } from "react";
import UserPreferencesComponent from '../userPreferences/UserPreferencesComponent';


export default function Home({ graphMode }) {
    const { user } = useAuthContext()
    // This is a flag to be toggled and inform when the user has updated their preferences
    const [preferencesUpdated, setPreferencesUpdated] = useState(false);

    const handlePreferencesUpdate = () => {
        setPreferencesUpdated((prev) => !prev);
    };

    return (
        <div className={styles.container}>
            <div className={styles.weatherForm}>
                {graphMode === "separated" ? (
                    <SeparatedGraphsRefactored preferencesUpdated={preferencesUpdated} />
                ) : (
                    <CombinedGraphRefactored preferencesUpdated={preferencesUpdated} />
                )}
            </div>
            <div className={styles.sidebar}>
                <UserPreferencesComponent uid={user.uid} onUpdate={handlePreferencesUpdate} />
            </div>
        </div>
    )
}