import React from "react";

interface InputCellProps {
	inputName: string;
	placeholder: string;
	rowName?: string;
	editingRowId: number | null;
  defaultValue: string;
  setFormData: any
}

const InputCell: React.FC<InputCellProps> = ({inputName, placeholder, defaultValue, editingRowId, setFormData}) => {
	function handleInputChange(event: React.ChangeEvent<HTMLInputElement> ) {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	}
  
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
