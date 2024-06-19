
import React from 'react';

import styles from './Sidebar.module.scss';

const Sidebar: React.FC = () => {
  return (
    <div className={styles.sidebar}>
      <ul>
        <li>По проекту</li>
        <li>Объекты</li>
        <li>РД</li>
        <li>МТО</li>
        <li>График</li>
      </ul>
    </div>
  );
};

export default Sidebar;
