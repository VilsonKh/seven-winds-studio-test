// src/components/Header/Header.tsx

import React from 'react';
import styles from './TableHeader.module.scss';

const TableHeader: React.FC = () => {
  return (
    <div className={styles.header}>
      <p>Строительно-монтажные работы</p>
    </div>
  );
};

export default TableHeader;
