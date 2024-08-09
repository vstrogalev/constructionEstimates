import { ReactElement, useEffect, useState } from "react";
import Table from "../Table/Table";
import {
  createConstructionCostAPI,
  deleteConstructionCostAPI,
  getConstructionCostsListAPI,
  updateConstructionCostAPI,
} from "./ConstructionTable.services";
import {
  ConstructionData,
  ConstructionDataRow,
  ConstructionDataRowWOChild,
  ConstructionRowRender,
} from "./ConstructionTable.types";

const columns = [
  "Уровень",
  "Наименование работ",
  "Основная з/п",
  "Оборудование",
  "Накладные расходы",
  "Сметная прибыль",
];

// полученные данные с сервера (дерево) преобразует в плоский массив объектов
// где кроме обычных данных строки, также указываем parentId для передачи его при клике по кнопке создания
// для передачи на сервер запроса
// также считаем уровень для отрисовки дерева в графе Уровень
function constructionDataToRender(
  data: ConstructionData,
  parent: number | null = null,
  level: number = 1
): ConstructionRowRender[] {
  let result: ConstructionRowRender[] = [];

  data.forEach((element) => {
    const {
      id,
      rowName,
      salary,
      equipmentCosts,
      overheads,
      estimatedProfit,
      child,
    } = element;
    const currentItem: ConstructionRowRender = {
      id,
      rowName,
      salary,
      equipmentCosts,
      overheads,
      estimatedProfit,
      level,
      parentId: parent,
    };

    result.push(currentItem);

    if (child.length) {
      const children = constructionDataToRender(child, id, level + 1);
      result = result.concat(children);
    }
  });

  return result;
}

function updateData(
  data: ConstructionData,
  changedRows: ConstructionDataRowWOChild[]
) {
  const changedRowsMap = new Map(changedRows.map((row) => [row.id, row]));

  const updateRow = (row: ConstructionDataRow): ConstructionDataRow => {
    const changedRow = changedRowsMap.get(row.id);
    if (changedRow) {
      return { ...row, ...changedRow, child: row.child.map(updateRow) };
    }
    return { ...row, child: row.child.map(updateRow) };
  };

  const result = data.map(updateRow);

  return result;
}

function deleteRow(data: ConstructionData, rowId: number): ConstructionData {
  const deleteRecursive = (rows: ConstructionData): ConstructionData => {
    return rows.filter(row => row.id !== rowId).map(row => ({
      ...row,
      child: deleteRecursive(row.child)
    }));
  };

  return deleteRecursive(data);
}

function ConstructionTable(): ReactElement {
  const [dataFromAPI, setDataFromAPI] = useState<ConstructionData>([]);
  // данные в плоском формате для рендеринга
  const [dataForRender, setDataForRender] = useState<ConstructionRowRender[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataFromServer = await getConstructionCostsListAPI();
        setDataFromAPI(dataFromServer);
      } catch (error) {
        console.error("Failed to fetch construction costs data", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setDataForRender(constructionDataToRender(dataFromAPI));
  }, [dataFromAPI]);

  const handleCreate = async (newRow: ConstructionRowRender) => {
    try {
      const { current, changed } = await createConstructionCostAPI(newRow);
      const updated = updateData(dataFromAPI, [current, ...changed]);

      setDataFromAPI(updated);
    } catch (err) {
      console.log("Ошибка во время обновления данных ", err);
    }
  };

  const handleUpdate = async (updatedData: ConstructionRowRender) => {
    try {
      const { current, changed } = await updateConstructionCostAPI(updatedData);
      const updated = updateData(dataFromAPI, [current, ...changed]);

      setDataFromAPI(updated);
    } catch (err) {
      console.log("Ошибка во время обновления данных ", err);
    }
  };

  const handleDelete = async (deletedRow: ConstructionRowRender) => {
    try {
      const { changed } = await deleteConstructionCostAPI(deletedRow);
      let updated = deleteRow(dataFromAPI, deletedRow.id);
      if (changed) {
        updated = updateData(updated, [...changed]);
      }
      
      setDataFromAPI(updated);
    } catch (err) {
      console.log("Ошибка во время обновления данных ", err);
    }
  }

  return (
    dataForRender && (
      <Table columns={columns} data={dataForRender} onUpdate={handleUpdate} onDelete={handleDelete} onCreate={handleCreate}/>
    )
  );
}

export default ConstructionTable;
