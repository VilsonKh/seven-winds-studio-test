// src/components/Table/Table.tsx

import React from 'react';
import RowList from "../RowList/RowList";
import styles from './Table.module.scss';

interface TableProps {
  eID: number;
}

const Table: React.FC<TableProps> = ({ eID }) => {
  return (
    <div className={styles.table}>
      <RowList eID={eID} />
    </div>
  );
};

export default Table;
