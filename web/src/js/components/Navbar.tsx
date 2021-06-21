import {Link} from "react-router-dom";

import styles from "../../styles/components/Navbar.module.scss";

export default function Navbar(): JSX.Element {
    return (
        <div className={styles.navbar}>
            <Link to={'/'} className={styles.nav_link}>
                Home
            </Link>
            <div className={styles.login_register}>
                <Link to={'/login'} className={styles.nav_link}>
                    Login
                </Link>
                <Link to={'/register'} className={styles.nav_link}>
                    Register
                </Link>
            </div>
        </div>
    );
}