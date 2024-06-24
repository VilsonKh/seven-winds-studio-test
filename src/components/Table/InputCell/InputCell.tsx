import React from "react";

interface InputCellProps {
	inputName: string;
	placeholder: string;
	rowName?: string;
	handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	editingRowId: number | null;
  defaultValue: string;
}

const InputCell: React.FC<InputCellProps> = ({inputName, placeholder, defaultValue, handleInputChange, editingRowId}) => {
	return (
		<td>
			<input
				type="text"
				placeholder={placeholder}
				name={inputName}
				defaultValue={defaultValue || ""}
				readOnly={!editingRowId}
				onChange={handleInputChange}
			/>
		</td>
	);
};

export default InputCell;
