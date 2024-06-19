// src/components/Header/Header.tsx

import React from 'react';
import styles from './Header.module.scss';

const Header: React.FC = () => {
  return (
    <div className={styles.header}>
      <h1>Строительно-монтажные работы</h1>
    </div>
  );
};

export default Header;
