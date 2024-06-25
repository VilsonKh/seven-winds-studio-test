import React, { useEffect, useState } from "react";
import styles from "./TableRow.module.scss";
import { createRow, deleteRow, updateRow } from "src/api/api";
import LevelCell from "../LevelCell/LevelCell";
import { tableColumns } from "src/const";
import InputCell from "../InputCell/InputCell";

interface TableRowProps {
	row?: any;
	setData?: any;
	editingRowId?: number | null;
	setIsEditingRowId?: (id: number | null) => void;
	level?: number;
	eID?: number;
	data?: any[];
	isLastChild: boolean;
	lastChildIndex: number;
}

const TableRow: React.FC<TableRowProps> = ({ row, setData, editingRowId, setIsEditingRowId, level, eID, isLastChild , lastChildIndex}) => {
	const isCurrentRowEditing = editingRowId === (row && row.id);

	const [formData, setFormData] = useState({
		rowName: "",
		salary: "",
		equipmentCosts: "",
		overheads: "",
		estimatedProfit: "",
	});

	async function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, parentId: number, tempId: number, rowId: number) {
		if (e.key === "Enter") {
			e.preventDefault();
			if (tempId) {
				try {
					// console.log("Adding new row. Parent ID:", parentId, "Form Data", formData);
					const newRow = await createRow(eID!, parentId, formData);
					console.log("New row created:", newRow);
					setData((prev) => insertNewRow(prev, newRow!.current, parentId, tempId));
					setIsEditingRowId(null);
				} catch (error) {
					console.error("Failed to add new row:", error);
				}
			} else if (rowId) {
				console.log("Updating existing row. Row ID:", rowId);
				setData((prevData) => {
					const rowToUpdate = findRowById(prevData, rowId);
					if (rowToUpdate) {
						updateRow(eID!, rowId.toString(), rowToUpdate)
							.then((updatedRow) => {
								setData((prev) => updateLocalData(prev, updatedRow.current));
								setIsEditingRowId(null); // Отключаем режим редактирования после обновления
							})
							.catch((error) => {
								console.error("Failed to update row:", error);
							});
					}
					return prevData; // Возвращаем текущее состояние
				});
			}
		}
	}

	function findRowById(items, rowId) {
		for (let item of items) {
			if (item.id === rowId) {
				return item;
			} else if (item.child) {
				const found = findRowById(item.child, rowId);
				if (found) return found;
			}
		}
		return null;
	}

	function updateLocalData(data: any[], updatedRow: any) {
		return data.map((item) => {
			if (item.id === updatedRow.id) {
				const existingChildren = item.child || [];
				return { ...updatedRow, child: existingChildren, isEditing: false };
			} else if (item.child) {
				return { ...item, child: updateLocalData(item.child, updatedRow) };
			}
			return item;
		});
	}

	function insertNewRow(data, newRow, parentId, tempId) {
		return data.map((item) => {
			if (item.id === parentId) {
				const updatedChildren = item.child
					? item.child.map((child) => {
							if (child.tempId === tempId) {
								return { ...newRow, isEditing: true };
							}
							return child;
					  })
					: [newRow];
				return { ...item, child: updatedChildren };
			} else if (item.child) {
				return { ...item, child: insertNewRow(item.child, newRow, parentId, tempId) };
			}
			return item;
		});
	}

	return (
		<>
			<tr
				className={`${isCurrentRowEditing ? styles.emptyRow : ""}`}
				onDoubleClick={() => setIsEditingRowId(editingRowId === row.id ? null : row.id)}
				onKeyDown={editingRowId ? (e) => handleKeyDown(e, row.parentId, row.tempId, row.id) : undefined}
			>
				<LevelCell
					level={level}
					row={row}
					editingRowId={editingRowId}
					setData={setData}
					eID={eID}
					setIsEditingRowId={setIsEditingRowId}
					isLastChild={isLastChild}
					lasdtChildIndex
				/>

				{tableColumns.map((column, i) => (
					<InputCell
						key={i}
						inputName={column.name}
						placeholder={column.placeholder}
						editingRowId={editingRowId}
						defaultValue={row ? row[column.name] : ""}
						setFormData={setFormData}
						isLastChild={isLastChild}
						lastChildIndex={lastChildIndex}
					/>
				))}
			</tr>
			{row &&
				row.child &&
				row.child.map((childRow: any, i: number, arr: any) => {
					console.log("index:", i, "lastChildIndex:", lastChildIndex, "rowName:", childRow.rowName);
					return (
						<TableRow
							key={childRow.id || childRow.tempId}
							row={childRow}
							setData={setData}
							editingRowId={editingRowId}
							setIsEditingRowId={setIsEditingRowId}
							level={level! + 1}
							eID={eID}
							isLastChild={i === row.child.length - 1 && childRow.child.length === 0}
							lastChildIndex={lastChildIndex}
						/>
					);
				})}
		</>
	);
};

export default TableRow;
