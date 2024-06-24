import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import TableHeader from "./components/Table/TableHeader/TableHeader";
import Table from "./components/Table/Table";
import { createEntity } from "./api/api";
import "./App.style.scss";
import Navigation from "./components/Navigation/Navigation";

const App: React.FC = () => {
	const [eID, setEID] = useState<number>();

	useEffect(() => {
		const fetchEntityID = async () => {
			const entityID = localStorage.getItem("entityID");
			console.log(entityID)
			if (entityID) {
				setEID(parseInt(entityID));
				return;
			} else {
				const entity = await createEntity();
				setEID(entity.id);
				localStorage.setItem("entityID", entity.id.toString());
			}
		};

		fetchEntityID();
	}, []);

	return (
		<div className="app">
			<Navigation />
			<div className="content__container">
				<Sidebar />
				<div className="content">{eID && <Table eID={eID} />}</div>
			</div>
		</div>
	);
};

export default App;
