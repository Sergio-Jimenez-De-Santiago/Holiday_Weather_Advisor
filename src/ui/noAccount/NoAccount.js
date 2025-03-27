import styles from '../home/Home.module.css';
import CombinedGraph from '../weatherOutput/CombinedGraph';
import SeparatedGraphs from '../weatherOutput/SeparatedGraphs';

export default function NoACcount({ graphMode }) {
    return (
        <div className={styles.weatherForm} style={{ width: '94%', margin: '2% auto 2%' }}>
            {graphMode === "separated" ? (
                <SeparatedGraphs noAccount={true} />
            ) : (
                <CombinedGraph noAccount={true} />
            )}
        </div>
    )
}