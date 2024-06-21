// src/components/Table/Table.tsx

import React, { useEffect, useState } from "react";
import RowList from "../RowList/RowList";
import styles from "./Table.module.scss";
import TableHeader from "../TableHeader/TableHeader";
import RowEditor from "../RowEditor/RowEditor";
import { createRow, deleteRow, fetchRows } from "../../api/api";
interface TableProps {
	eID: number;
}

const RecursiveTableRow = React.memo(({level, i,item, isEditingRow, setIsEditingRow, setData, data, eID, setParentId }: any) => {
  // console.log("Rendering row:", item.rowName, "Level:", level, "Margin left:", `${level * 20}px`);

	function handleEditMode(e: any) {

    setData(prevData => {
      const toggleEditMode = (items) => {
        return items.map(item => {
          if (item.id === Number(e.target.closest("tr").getAttribute("data-id"))) {
            return { ...item, isEditing: !item.isEditing };
          } else if (item.child) {
            return { ...item, child: toggleEditMode(item.child) };
          }
          return item;
        });
      };
      return toggleEditMode(prevData);
    });
	}

	function handleMouseOver() {
		if (isEditingRow) return;
		document.querySelectorAll(`.${styles.icons}`).forEach((el) => {
			el.classList.add(styles.active);
		});

		document.querySelectorAll(`.${styles.deleteIcon}`).forEach((el) => {
			el.classList.add(styles.active);
		});
	}

	function handleMouseOut() {
		if (isEditingRow) return;
		document.querySelectorAll(`.${styles.icons}`).forEach((el) => {
			el.classList.remove(styles.active);
		});

		document.querySelectorAll(`.${styles.deleteIcon}`).forEach((el) => {
			el.classList.remove(styles.active);
		});
	}

	async function handleDeleteRow(rID: number) {
		deleteRow(eID, rID);

		setData(data.filter((row: any) => row.id !== rID));
	}

	function handleAddNewRow(parentId: number) {
    console.log(setParentId)
    setParentId(parentId)
    setData((prevData) => {
      // Функция для рекурсивного добавления новой строки
      
      function addNewRow(items) {

        if(!items) {
          console.error("No items available")
          return []
        }

        return items.map((item) => {
          if (item.id === parentId) {
            console.log('found')
            // Если найден родительский элемент, добавляем новый элемент в его children
            const newChild = {
              id: Date.now(),
              rowName: "",
              salary: 0,
              equipmentCosts: 0,
              overheads: 0,
              estimatedProfit: 0,
              child: [],
              isEditing: true,
              parentId: item.id
            };

            return { ...item, child: [...(item.child || []), newChild] };
          } else if (item.child) {
            // Если не найден, продолжаем поиск в дочерних элементах
            return { ...item, child: addNewRow(item.child) };
          }
          return item;
        });
      }
  
      const updatedData = addNewRow(prevData)
      console.log("Updated data:", updatedData)
      return updatedData
    });
  }

  function handleInputChange(event, id) {
    const { name, value } = event.target;
    setData(prevData => {
      const updateData = (items) => {
        return items.map(item => {
          if (item.id === id) {
            return { ...item, [name]: value };
          } else if (item.child) {
            return { ...item, child: updateData(item.child) };
          }
          return item;
        });
      };
      return updateData(prevData);
    });
  }

	return (
	<>
	  	<tr
  			className={styles.editingRow}
        data-id={item.id}
  			key={item.id}
  			onDoubleClick={handleEditMode}
  		>
  			<td
  				style={{ width: "100px" }}
  				onMouseOver={!item.isEditing ? handleMouseOver : undefined}
  				onMouseOut={!item.isEditing ? handleMouseOut : undefined}
  			>
  				<div
  					className={styles.levelContainer}
  					style={{ marginLeft: `${level * 20}px` }}
  				>
  					<div
  						id={`icons-${item.id}`}
  						className={styles.icons}
  					>
  						<button
  							//TODO вынести в отдельную проверку уровней добавить проверку если есть два первых родительских узла без детей
  							className={`${styles.documentIcon}`}
  							type="button"
  							onClick={() => handleAddNewRow(item.id)}
  						>
  							<img
  								src="./img/document-filled.svg"
  								alt="document"
  							/>
  						</button>
  						<button
  							className={styles.deleteIcon}
  							onClick={() => handleDeleteRow(item.id)}
  							type="button"
  						>
  							<img
  								src="./img/basket.svg"
  								alt="basket"
  							/>
  						</button>
  					</div>
  				</div>
  			</td>
  			<td>
  				<input
  					type="text"
  					value={item.rowName}
  					name="rowName"
            className={item.isEditing ? styles.activeInput : ""}
            onChange={e => handleInputChange(e, item.id)}
  					readOnly={!item.isEditing}
  				/>
  			</td>
  			<td>
  				<input
  					type="text"
  					value={item.salary}
  					name="salary"
            className={item.isEditing ? styles.activeInput : ""}
            onChange={e => handleInputChange(e, item.id)}
  					readOnly={!item.isEditing}
  				/>
  			</td>
  			<td>
  				<input
  					type="text"
  					value={item.equipmentCosts}
  					name="equipmentCosts"
            className={item.isEditing ? styles.activeInput : ""}
            onChange={e => handleInputChange(e, item.id)}
  					readOnly={!item.isEditing}
  				/>
  			</td>
  			<td>
  				<input
  					type="text"
  					value={item.overheads}
  					name="overheads"
            className={item.isEditing ? styles.activeInput : ""}
            onChange={e => handleInputChange(e, item.id)}
  					readOnly={!item.isEditing}
  				/>
  			</td>
  			<td>
  				<input
  					type="text"
  					value={item.estimatedProfit}
  					name="estimatedProfit"
            className={item.isEditing ? styles.activeInput : ""}
            onChange={e => handleInputChange(e, item.id)}
  					readOnly={!item.isEditing}
  				/>
  			</td>
  		</tr>
      {item.child && item.child.map(childItem => (
        <RecursiveTableRow setParentId={setParentId} level={level + 1} key={childItem.id} item={childItem} isEditingRow={isEditingRow} setIsEditingRow={setIsEditingRow} setData={setData} data={data} eID={eID} />
      ))}
	</>
	)
});

const Table: React.FC<TableProps> = ({ eID }) => {
	const [isEditingRow, setIsEditingRow] = useState<boolean>(false);
	const [data, setData] = useState<any[]>([]);
  const [parentId, setParentId] = useState<number | null>(null);
  console.log(data)

	useEffect(() => {
		const fetchData = async () => {
			const rows = await fetchRows(eID);
			setData(rows);
		};
		fetchData();
	}, []);

	console.log(data);

	useEffect(() => {
		document.addEventListener("click", (e) => {
			const table = (e.target as HTMLElement).closest("table");
			if (table === null) {
				setIsEditingRow(false);
				document.querySelectorAll("input").forEach((el) => {
					el.classList.remove(styles.activeInput);
					// el.setAttribute("readOnly", "true");
				});
			}
		});
	}, []);

	function handleSubmit(e: React.KeyboardEvent<HTMLFormElement>) {
		if (e.key === "Enter") {
			console.log("Enter pressed");
			e.preventDefault();
			const formData = new FormData(e.currentTarget);
      console.log(formData)

			createRow(eID, parentId, formData).then((data) => {
        setIsEditingRow(false);
        // setData([...data.current])
			});
		}
	}

	return (
		<div className={styles.table}>
			<TableHeader />
			<form onKeyDown={handleSubmit}>
				<table>
					<thead>
						<tr>
							<th>Уровень</th>
							<th>Наименование работ</th>
							<th>Основная з/п</th>
							<th>Оборудование</th>
							<th>Накладные расходы</th>
							<th>Сметная прибыль</th>
						</tr>
					</thead>
					<tbody>
						{data.length > 0 ? (
							data.map((row, i) => (
								<RecursiveTableRow
									key={row.id}
									item={row}
									index={i}
									isEditingRow={isEditingRow}
									setIsEditingRow={setIsEditingRow}
                  i={i}
                  level={0}
                  eID = {eID}
                  data={data}
                  setData = {setData}
                  setParentId= {setParentId}
								/>
							))
						) : (
							<RowEditor />
						)}
					</tbody>
				</table>
			</form>
		</div>
	);
};

export default Table;
