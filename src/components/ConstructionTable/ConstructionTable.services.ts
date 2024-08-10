import { REACT_APP_CONSTRUCTION_COSTS_API_URL, REACT_APP_ENTITY_ID_API } from "../../common/_constants";
import {
  ConstructionData,
  ConstructionDataCreateRequest,
  ConstructionDataUpdateRequest,
  ConstructionDataUpdateResponse,
  ConstructionRowRender,
} from "./ConstructionTable.types";

const URL = REACT_APP_CONSTRUCTION_COSTS_API_URL;
const ENTITY_ID_API = REACT_APP_ENTITY_ID_API;

if (!URL || !ENTITY_ID_API) {
  console.error("Environment variables are not defined properly:", {
    URL,
    ENTITY_ID_API,
  });
  throw new Error("Environment variables are not defined properly");
}

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

export const getConstructionCostsListAPI = () =>
  fetch(`${URL}/${ENTITY_ID_API}/row/list`)
    .then((res) => checkResponse<ConstructionData>(res))
    .then((data) => {
      if (data.length) return data;
      return Promise.reject(data);
    });

export const createConstructionCostAPI = async (
  createdRow: ConstructionRowRender
) => {
  const rowForCreate: ConstructionDataCreateRequest = {
    equipmentCosts: createdRow.equipmentCosts,
    estimatedProfit: createdRow.estimatedProfit,
    machineOperatorSalary: 0,
    mainCosts: 0,
    materials: 0,
    mimExploitation: 0,
    overheads: createdRow.overheads,
    rowName: createdRow.rowName,
    salary: createdRow.salary,
    supportCosts: 0,
    parentId: createdRow.parentId,
  };

  const res = await fetch(`${URL}/${ENTITY_ID_API}/row/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    } as HeadersInit,
    body: JSON.stringify(rowForCreate),
  });

  const data = await checkResponse<ConstructionDataUpdateResponse>(res);

  if (data.current) return data;
  return Promise.reject(data);
};

export const updateConstructionCostAPI = async (
  updatedRow: ConstructionRowRender
) => {
  const rowForUpdate: ConstructionDataUpdateRequest = {
    equipmentCosts: updatedRow.equipmentCosts,
    estimatedProfit: updatedRow.estimatedProfit,
    machineOperatorSalary: 0,
    mainCosts: 0,
    materials: 0,
    mimExploitation: 0,
    overheads: updatedRow.overheads,
    rowName: updatedRow.rowName,
    salary: updatedRow.salary,
    supportCosts: 0,
  };

  const res = await fetch(
    `${URL}/${ENTITY_ID_API}/row/${updatedRow.id}/update`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      } as HeadersInit,
      body: JSON.stringify(rowForUpdate),
    }
  );

  const data = await checkResponse<ConstructionDataUpdateResponse>(res);

  if (data.changed) return data;
  return Promise.reject(data);
};

export const deleteConstructionCostAPI = async (
  deletedRow: ConstructionRowRender
) => {
  const res = await fetch(
    `${URL}/${ENTITY_ID_API}/row/${deletedRow.id}/delete`,
    {
      method: "DELETE",
    }
  );

  const data = await checkResponse<ConstructionDataUpdateResponse>(res);

  return data;
};
