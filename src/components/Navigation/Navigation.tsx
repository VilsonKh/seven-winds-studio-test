import React from 'react'
import styles from "./Navigation.module.scss";
const Navigation = () => {
  return (
    <div className={styles.container}>
      <button  className={styles.navButton}>
        <img src="/img/dots-menu.svg" alt="menu button" />
      </button>
      <button  className={styles.navButton}>
        <img src="/img/back.svg" alt="back button" />
      </button>
      <button className={`${styles.navButton} ${styles.active}`}>Просмотр</button>
      <button className={styles.navButton}>Управление</button>
    </div>
  )
}

export default Navigation