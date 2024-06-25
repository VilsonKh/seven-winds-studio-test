import React, { useEffect, useState } from "react";
import TableHeader from "./TableHeader/TableHeader";
import { fetchRows } from "src/api/api";
import styles from "./Table.module.scss";
import TableRow from "./TableRow/TableRow";

const Table = ({ eID }: { eID: number }) => {
	const [data, setData] = useState([]);
	const [editingRowId, setIsEditingRowId] = useState<number | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			const rows = await fetchRows(eID);
			console.log(rows);
			setData(rows);
		};

		fetchData();
	}, []);

	return (
		<div className={styles.table}>
			<TableHeader />
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
						data.map((row: any, i: number) => {

							return (
								<TableRow
									key={i}
									setData={setData}
									row={row}
									editingRowId={editingRowId}
									setIsEditingRowId={setIsEditingRowId}
									level={0}
									eID={eID}
									data={data}
									lastChildIndex={row.child.length - 1 }
								/>
							);
						})
					) : (
						<TableRow />
					)}
				</tbody>
			</table>
		</div>
	);
};

export default Table;
