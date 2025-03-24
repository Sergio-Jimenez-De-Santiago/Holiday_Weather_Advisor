import styles from './Navbar.module.css';
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaInfoCircle } from 'react-icons/fa'
import { useLogout } from '../../hooks/useLogout'
import { useAuthContext } from '../../hooks/useAuthContext'
import { color } from 'chart.js/helpers';
import { BiFontSize } from 'react-icons/bi';

export default function Navbar({ toggleGraphMode }) {
    const { logout } = useLogout()
    const { user } = useAuthContext()

    const location = useLocation()
    const showToggleButton = (
        location.pathname === "/Holiday-Weather-Advisor" ||
        location.pathname === "/Holiday-Weather-Advisor/noAccount"
    );

    const [showInfo, setShowInfo] = useState(false)
    const handleOpenInfo = () => {
        setShowInfo(true)
    }
    const handleCloseInfo = () => {
        setShowInfo(false)
    }
    const stopPropagation = (e) => {
        e.stopPropagation()
    }

    return (
        <nav className={styles.navbar}>
            <ul>
                <li className={styles.title}>Holiday Weather Advisor</li>
                <li className={styles.infoIcon} onClick={handleOpenInfo}>
                    <FaInfoCircle />
                </li>

                {showToggleButton && (
                    <li>
                        <button className="btn" onClick={toggleGraphMode}>Toggle Graph</button>
                    </li>
                )}

                {!user && (
                    <>
                        <li><Link to="/Holiday-Weather-Advisor/login">Login</Link></li>
                        <li><Link to="/Holiday-Weather-Advisor/signup">Signup</Link></li>
                        <li><Link to="/Holiday-Weather-Advisor/noAccount">Use without account</Link></li>
                    </>
                )}

                {user && (
                    <>
                        <li className={styles.greeting} >Hello, {user.displayName}</li>
                        <li>
                            <button className='btn' onClick={logout}>Logout</button>
                        </li>
                    </>
                )}
            </ul>
            {showInfo && (
                <div className={styles.popupOverlay} onClick={handleCloseInfo}>
                    <div className={styles.popupContent} onClick={stopPropagation}>
                        <button className={styles.closeButton} onClick={handleCloseInfo}>
                            X
                        </button>
                        <h2>Information</h2>
                        <p>
                            The Holiday Weather Advisor allows users to retrieve weather data for a given time range,
                            which can help inform decision-making in weather-related matters.
                        </p>

                        <p>
                            For up to 14 days from the current date (including day 14), the displayed information
                            is based on forecast data. Beyond that, forecast data becomes less reliable, so
                            we present data based on historical records from the last 15 years.
                        </p>

                        <p>
                            This application is made possible thanks to 
                            <a style={{ color: 'blue', margin: 0 }} href="https://open-meteo.com/en/docs" target="_blank" rel="noopener noreferrer" > Open-Meteo </a>
                            and their free weather APIs.
                        </p>
                    </div>
                </div>
            )}
        </nav>
    )
}