import React, { useState } from 'react';
import styles from './RowEditor.module.scss';

interface RowEditorProps {
  row: {
    id: string;
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
  };
  onSave: (rID: string, updatedData: any) => void;
  onCancel: () => void;
}

const RowEditor: React.FC<RowEditorProps> = ({ row, onSave, onCancel }) => {
  const [rowName, setRowName] = useState(row.rowName);
  const [equipmentCosts, setEquipmentCosts] = useState(row.equipmentCosts);
  const [estimatedProfit, setEstimatedProfit] = useState(row.estimatedProfit);
  const [machineOperatorSalary, setMachineOperatorSalary] = useState(row.machineOperatorSalary);
  const [mainCosts, setMainCosts] = useState(row.mainCosts);
  const [materials, setMaterials] = useState(row.materials);
  const [mimExploitation, setMimExploitation] = useState(row.mimExploitation);
  const [overheads, setOverheads] = useState(row.overheads);
  const [salary, setSalary] = useState(row.salary);
  const [supportCosts, setSupportCosts] = useState(row.supportCosts);

  const handleSave = () => {
    onSave(row.id, {
      rowName,
      equipmentCosts,
      estimatedProfit,
      machineOperatorSalary,
      mainCosts,
      materials,
      mimExploitation,
      overheads,
      salary,
      supportCosts,
    });
    onCancel();
  };

  return (
    <div className={styles.rowEditor}>
      <input value={rowName} onChange={e => setRowName(e.target.value)} placeholder="Название" />
      <input type="number" value={equipmentCosts} onChange={e => setEquipmentCosts(Number(e.target.value))} placeholder="Затраты на оборудование" />
      <input type="number" value={estimatedProfit} onChange={e => setEstimatedProfit(Number(e.target.value))} placeholder="Ожидаемая прибыль" />
      <input type="number" value={machineOperatorSalary} onChange={e => setMachineOperatorSalary(Number(e.target.value))} placeholder="Зарплата оператора" />
      <input type="number" value={mainCosts} onChange={e => setMainCosts(Number(e.target.value))} placeholder="Основные затраты" />
      <input type="number" value={materials} onChange={e => setMaterials(Number(e.target.value))} placeholder="Материалы" />
      <input type="number" value={mimExploitation} onChange={e => setMimExploitation(Number(e.target.value))} placeholder="Эксплуатация" />
      <input type="number" value={overheads} onChange={e => setOverheads(Number(e.target.value))} placeholder="Накладные расходы" />
      <input type="number" value={salary} onChange={e => setSalary(Number(e.target.value))} placeholder="Зарплата" />
      <input type="number" value={supportCosts} onChange={e => setSupportCosts(Number(e.target.value))} placeholder="Поддержка" />
      <button onClick={handleSave}>Сохранить</button>
      <button onClick={onCancel}>Отмена</button>
    </div>
  );
};

export default RowEditor;
