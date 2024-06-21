import React, { useState } from "react";
import styles from "./RowEditor.module.scss";

const RowEditor = () => {

  function handleMouseOver() {
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
		<tr className={styles.emptyRow}>
			<td onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
				<div className={styles.icons}>
					<button className={styles.documentIcon}>
						<img
							src="./img/document-filled.svg"
							alt="document"
						/>
					</button>
					<button className={styles.deleteIcon}>
						<img
							src="./img/basket.svg"
							alt="basket"
						/>
					</button>
				</div>
			</td>
			<td>
				<input type="text" placeholder={"Наименование работ"} name="rowName"/>
			</td>
			<td>
				<input type="text" placeholder={"Основная з/п"} name="salary"/>
			</td>
			<td>
				<input type="text" placeholder={"Оборудование"} name="equipmentCosts"/>
			</td>
			<td>
				<input type="text" placeholder={"Накладные расходы"} name="overheads"/>
			</td>
			<td>
				<input type="text" placeholder={"Сметная прибыль"} name="estimatedProfit"/>
			</td>
		</tr>
	);
};

export default RowEditor;
