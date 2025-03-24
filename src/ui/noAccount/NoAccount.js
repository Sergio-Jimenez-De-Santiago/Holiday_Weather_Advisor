import styles from '../home/Home.module.css';
import CombinedGraphRefactored from '../weatherOutput/CombinedGraphRefactored';
import SeparatedGraphsRefactored from '../weatherOutput/SeparatedGraphsRefactored';

export default function NoACcount({ graphMode }) {
    return (
        <div className={styles.weatherForm} style={{ width: '94%', margin: '2% auto 2%' }}>
            {graphMode === "separated" ? (
                <SeparatedGraphsRefactored noAccount={true} />
            ) : (
                <CombinedGraphRefactored noAccount={true} />
            )}
        </div>
    )
}