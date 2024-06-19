import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import Table from './components/Table/Table';
import { createEntity } from './api/api';
import './App.style.scss';

const App: React.FC = () => {
  const [eID, setEID] = useState<number>();

  useEffect(() => {
    const fetchEntityID = async () => {
      const entity = await createEntity();
			console.log(entity)
      setEID(entity.id);
    };

    fetchEntityID();
  }, []);

  return (
    <div className="app">
      <Sidebar />
      <div className="content">
        <Header />
        {eID && <Table eID={eID} />}
      </div>
    </div>
  );
};

export default App;
