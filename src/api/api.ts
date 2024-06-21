const API_ADDRESS = "http://185.244.172.108:8081/v1/outlay-rows/entity";

export async function createEntity(): Promise<{ id: number; rowName: string }> {
	const response = await fetch(`${API_ADDRESS}/create`, {
		method: "POST",
	});
	const data = await response.json();
	return data;
}

export async function fetchRows(eID: number) {
	const response = await fetch(`${API_ADDRESS}/${eID}/row/list`);
	const data = await response.json();
	return data;
}

interface OutlayRowRequest {
	equipmentCosts: number;
	estimatedProfit: number;
	machineOperatorSalary: number;
	mainCosts: number;
	materials: number;
	mimExploitation: number;
	overheads: number;
	parentId: number | null;
	rowName: string;
	salary: number;
	supportCosts: number;
}

const defaultData = {
	"machineOperatorSalary": 0,
	"mainCosts": 0,
	"materials": 0,
	"mimExploitation": 0,
	"supportCosts": 0
}

export async function createRow(eID: number,parentId: number | null, row: any) {
	
	const convertedFormData: Record<string, number | string> = {}
	row.forEach((value: any, key: any) => {
		convertedFormData[key] = value
	})
	const combinedData = {...defaultData, ...convertedFormData, parentId}
	console.log(convertedFormData)
	const response = await fetch(`${API_ADDRESS}/${eID}/row/create`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(combinedData),
	});
	const data = await response.json();
	console.log(data)
	return data;
}

interface OutlayRowUpdateRequest {
	equipmentCosts: number;
	estimatedProfit: number;
	machineOperatorSalary: number;
	mainCosts: number;
	materials: number;
	mimExploitation: number;
	overheads: number;
	rowName: string;
	salary: number;
	supportCosts: number;
}

export async function updateRow(eID: number, rID: string, row: OutlayRowUpdateRequest) {
	const response = await fetch(`${API_ADDRESS}/${eID}/row/${rID}/update`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(row),
	});
	const data = await response.json();
	return data;
}

export const deleteRow = async (eID: number, rID: number) => {
  await fetch(`${API_ADDRESS}/${eID}/row/${rID}/delete`, {
    method: 'DELETE',
  });
};
