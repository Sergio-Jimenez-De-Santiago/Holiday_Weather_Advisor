import styles from './Signup.module.css';
import { useState } from 'react';
import { useSignup } from '../../hooks/useSignup';

export default function Home() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [displayName, setDisplayName] = useState('')
    const { signup, isPending, error } = useSignup()

    const handleSumbit = (e) => {
        e.preventDefault()
        signup(email, password, displayName)
    }

    return (
        <form onSubmit={handleSumbit} className={styles['signup-form']}>
            <h2>Signup</h2>
            <label>
                <span>email:</span>
                <input
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
            </label>
            <label>
                <span>password:</span>
                <input
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
            </label>
            <label>
                <span>name:</span>
                <input
                    type="text"
                    onChange={(e) => setDisplayName(e.target.value)}
                    value={displayName}
                />
            </label>
            {!isPending && <button className='btn'>Signup</button>}
            {isPending && <button className='btn' disabled>loading</button>}
            {error && <p>{error}</p>}
        </form>
    )
}