import styles from "./Header.module.css"
import { useAuth } from "../../auth/useAuth";
import {User} from "lucide-react";


function Header({sectionName}){
    const { user, logoutUser, accessToken } = useAuth();
    return(
        <header className={styles.header}>
            <h2 className={styles.headerItemLeft}>{sectionName}</h2>
            <div className={`${styles.userProfile} ${styles.headerItemRight}`}>
                <User size={22} />
                <span className={styles.userName}>
                {user?.firstName}  {user?.lastName[0]}
                </span>
            </div>
        </header>
    )
}

export default Header;