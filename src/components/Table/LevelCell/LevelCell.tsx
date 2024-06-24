import React from "react";
import styles from "./LevelCell.module.scss";

interface LevelCellProps {
	handleAddNewChild: (rowId: number) => void;
	handleDeleteRow: (rowId: number) => void;
	level: number;
	row: { id: number };
  editingRowId: number | null;

}

const LevelCell: React.FC<LevelCellProps> = ({ handleAddNewChild, handleDeleteRow, level, row, editingRowId, }): JSX.Element => {
	const marginLeft = `${level && level * 20}px`;

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
				className={styles.documentIcon}
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
