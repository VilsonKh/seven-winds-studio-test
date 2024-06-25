import React from "react";
import styles from "./LevelCell.module.scss";
import { deleteRow } from "src/api/api";

interface LevelCellProps {
	level: number;
	row: { id: number };
  editingRowId: number | null;
  setData: any;
  setIsEditingRowId: (id: number | null) => void;
  eID?: number;
  isLastChild: boolean;
  lastChildIndex
}

const LevelCell: React.FC<LevelCellProps> = ({ level, row, editingRowId, setData, eID, setIsEditingRowId, isLastChild, lastChildIndex }): JSX.Element => {
	const marginLeft = `${level && level * 20}px`;
  const isParent = row && row.child && row.child.length > 0;
  function handleMouseOver() {
		if (editingRowId) return;
		document.querySelectorAll(`.${styles.icons}`).forEach((el) => {
			el.classList.add(styles.active);
		});

		document.querySelectorAll(`.${styles.deleteIcon}`).forEach((el) => {
			el.classList.add(styles.active);
		});
	}

	function handleMouseOut() {
		document.querySelectorAll(`.${styles.icons}`).forEach((el) => {
			el.classList.remove(styles.active);
		});

		document.querySelectorAll(`.${styles.deleteIcon}`).forEach((el) => {
			el.classList.remove(styles.active);
		});
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
		setIsEditingRowId(newChild.tempId);
	}

	return (
    <td
					onMouseOver={editingRowId === undefined ? undefined : handleMouseOver}
					onMouseOut={editingRowId === undefined ? undefined : handleMouseOut}
				>
		<div
			className={styles.icons}
			style={{ marginLeft }}
		>
			<button
				className={`${styles.documentIcon} ${isLastChild ? styles.nextChild :(isParent ? styles.parent: styles.child)} `}
				onClick={() => handleAddNewChild(row.id)}
			>
				<img
					src="./img/document-filled.svg"
					alt="document"
				/>
			</button>
			<button
				className={styles.deleteIcon}
				onClick={() => handleDeleteRow(row.id)}
			>
				<img
					src="./img/basket.svg"
					alt="basket"
				/>
			</button>
		</div>
  </td>
	);
};

export default LevelCell;
