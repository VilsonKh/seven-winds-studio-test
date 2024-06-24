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
}

const TableRow: React.FC<TableRowProps> = ({ row, setData, editingRowId, setIsEditingRowId, level, eID, data }) => {
	const isCurrentRowEditing = editingRowId === (row && row.id);

	const [formData, setFormData] = useState({
		rowName: "",
		salary: "",
		equipmentCosts: "",
		overheads: "",
		estimatedProfit: "",
	});

	function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		console.log(formData);
	}

	async function handleDeleteRow(rID: number) {
		const success = await deleteRow(eID!, rID);
		if (success) {
			setData((prev) => deleteRowLocally(rID, prev));
		} else {
			console.error("Fauled to delete row locally due to server error");
		}
	}

	function deleteRowLocally(rowId, items) {
		return items.reduce((acc, item) => {
			if (item.id !== rowId) {
				const newItem = { ...item };
				if (item.child && item.child.length > 0) {
					newItem.child = deleteRowLocally(rowId, item.child);
				}
				acc.push(newItem);
			}
			return acc;
		}, []);
	}

	function handleAddNewChild(parentId: number) {
		const newChild = {
			tempId: Date.now(),
			rowName: "",
			salary: "",
			equipmentCosts: "",
			overheads: "",
			estimatedProfit: "",
			child: [],
			isEditing: true,
			parentId,
		};

		setData((prevData: any) => {
			const addNewChild = (items: any, parentId: number) => {
				return items.map((item: any) => {
					if (item.id === parentId) {
						const updatedItem = {
							...item,
							child: [...(item.child || []), newChild],
						};
						return updatedItem;
					} else if (item.child) {
						return { ...item, child: addNewChild(item.child, parentId) };
					}
					return item;
				});
			};

			return addNewChild(prevData, parentId);
		});
		console.log(parentId);
		setIsEditingRowId(newChild.tempId);
	}

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
				// Сохраняем существующих детей, если они есть
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
					handleAddNewChild={handleAddNewChild}
					handleDeleteRow={handleDeleteRow}
					level={level}
					row={row}
					editingRowId={editingRowId}
				/>

				{tableColumns.map((column, i) => (
					<InputCell
						key={i}
						inputName={column.name}
						placeholder={column.placeholder}
						handleInputChange={handleInputChange}
						editingRowId={editingRowId}
						defaultValue={row ? row[column.name] : ""}
					/>
				))}
			</tr>
			{row &&
				row.child &&
				row.child.map((childRow: any, i: number) => {
					return (
						<TableRow
							key={childRow.id || childRow.tempId}
							row={childRow}
							setData={setData}
							editingRowId={editingRowId}
							setIsEditingRowId={setIsEditingRowId}
							level={level! + 1}
							eID={eID}
						/>
					);
				})}
		</>
	);
};

export default TableRow;
