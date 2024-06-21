import React from "react";

import styles from "./Sidebar.module.scss";

const Sidebar: React.FC = () => {

  const menuDocuments = [
    "По проекту",
    "Объекты",
    "РД",
    "МТО",
    "СМР",
    "График",
    "МиМ",
    "Рабочие",
    "Капвложения",
    "Бюджет",
    "Финансирование",
    "Панорамы",
    "Камеры",
    "Поручения",
    "Контрагенты",
  ]

	return (
		<div className={styles.sidebar}>
			<div className={styles.header}>
				<div>
					<p>Название проекта</p>
					<p>Аббревиатура</p>
				</div>
				<img
					src="/img/arrow-down.svg"
					alt="arrow"
				/>
			</div>
			<ul>
				{menuDocuments.map((item, i) => (
					<li className={i === 4 ? styles.active : ""} key={i}>
            <img src="/img/document.svg" alt="document" />
            <p>{item}</p>
          </li>
				))}
			</ul>
		</div>
	);
};

export default Sidebar;
