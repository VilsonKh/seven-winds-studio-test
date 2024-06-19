import React, { useState, useEffect } from 'react';
import { fetchRows, createRow, updateRow, deleteRow } from '../../api/api';
import RowEditor from '../RowEditor/RowEditor';
import styles from './RowList.module.scss';

interface Row {
  id: string;
  parentId: string | null;
  rowName: string;
  equipmentCosts: number;
  estimatedProfit: number;
  machineOperatorSalary: number;
  mainCosts: number;
  materials: number;
  mimExploitation: number;
  overheads: number;
  salary: number;
  supportCosts: number;
  total: number;
}

interface RowListProps {
  eID: number;
}

const RowList: React.FC<RowListProps> = ({ eID }) => {
  const [rows, setRows] = useState<Row[]>([]);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);

  useEffect(() => {
    const loadRows = async () => {
      const rowsData = await fetchRows(eID);
      setRows(rowsData);
    };
    loadRows();
  }, [eID]);

  const handleCreateRow = async (parentId: number | null) => {
    const newRow = await createRow(eID, {
      equipmentCosts: 0,
      estimatedProfit: 0,
      machineOperatorSalary: 0,
      mainCosts: 0,
      materials: 0,
      mimExploitation: 0,
      overheads: 0,
      parentId,
      rowName: '',
      salary: 0,
      supportCosts: 0,
    });
    setRows([...rows, newRow]);
  };

  const handleUpdateRow = async (rID: string, updatedData: any) => {
    const updatedRow = await updateRow(eID, rID, updatedData);
    setRows(rows.map(row => (row.id === rID ? updatedRow : row)));
  };

  const handleDeleteRow = async (rID: string) => {
    await deleteRow(eID, rID);
    setRows(rows.filter(row => row.id !== rID));
  };

  return (
    <div className={styles.rowList}>
      <button onClick={() => handleCreateRow(null)}>Создать корневую строку</button>
      <ul>
        {rows.map(row => (
          <li key={row.id}>
            <span>{row.rowName || 'Без названия'}</span>
            <button onClick={() => setEditingRowId(row.id)}>Редактировать</button>
            <button onClick={() => handleDeleteRow(row.id)}>Удалить</button>
          </li>
        ))}
      </ul>
      {editingRowId && (
        <RowEditor
          row={rows.find(row => row.id === editingRowId)!}
          onSave={handleUpdateRow}
          onCancel={() => setEditingRowId(null)}
        />
      )}
    </div>
  );
};

export default RowList;
