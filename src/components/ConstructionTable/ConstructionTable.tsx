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
  ConstructionDataRowRespose,
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
function convertDataForRender(
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
      children: child.length
    };

    result.push(currentItem);

    if (child.length) {
      // Сортировка детей по количеству детей (сначала без детей)
      const sortedChildren = child.sort((a, b) => a.child.length - b.child.length);
      
      // Рекурсивный вызов для детей
      const children = convertDataForRender(sortedChildren, id, level + 1);
      result = result.concat(children);
    }
  });

  return result;
}

// Функция для обновления данных
function updateData(
  data: ConstructionData,
  changedRows: ConstructionDataRowRespose[]
): ConstructionData {
  
  const changedRowsMap = new Map(changedRows.map((row) => [row.id, row]));

  const updateRow = (row: ConstructionDataRow): ConstructionDataRow => {
    const changedRow = changedRowsMap.get(row.id);
    if (changedRow) {
      return {
        ...row,
        ...changedRow,
        child: row.child.map(updateRow)
      };
    }
    return {
      ...row,
      child: row.child.map(updateRow)
    };
  };

  return data.map(updateRow);
}

function deleteRow(data: ConstructionData, rowId: number): ConstructionData {
  const deleteRecursive = (rows: ConstructionData): ConstructionData => {
    return rows
      .filter((row) => row.id !== rowId)
      .map((row) => ({
        ...row,
        child: deleteRecursive(row.child),
      }));
  };

  return deleteRecursive(data);
}

// функция для добавления новой строки как ребенка какого-то родителя
function addNewRowToParent(
  data: ConstructionData,
  newRow: ConstructionRowRender
): ConstructionData {
  const {
    id,
    equipmentCosts,
    estimatedProfit,
    overheads,
    rowName,
    salary,
    parentId,
  } = newRow;
  const newRowConstructData: ConstructionDataRow = {
    id: id,
    equipmentCosts: equipmentCosts,
    estimatedProfit: estimatedProfit,
    overheads: overheads,
    rowName: rowName,
    salary: salary,
    total: 0,
    mimExploitation: 0,
    machineOperatorSalary: 0,
    mainCosts: 0,
    materials: 0,
    supportCosts: 0,
    child: [],
  };

  const addRowRecursive = (nodes: ConstructionData): ConstructionData => {
    return nodes.map((node) => {
      if (node.id === parentId) {
        return {
          ...node,
          child: [...node.child, newRowConstructData],
        };
      } else {
        return {
          ...node,
          child: addRowRecursive(node.child),
        };
      }
    });
  };

  if (parentId === null) {
    // Если parentId равен null, добавляем новую строку на верхний уровень
    return [...data, newRowConstructData];
  } else {
    // Иначе, добавляем новую строку к родительскому элементу
    return addRowRecursive(data);
  }
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

        if (dataFromServer.length === 0) {
          // если нет данных, то создаем пустую строку
          handleCreate({
            id: -1, // ID заглушка, потом получим нормальный от сервера
            rowName: "",
            salary: 0,
            equipmentCosts: 0,
            overheads: 0,
            estimatedProfit: 0,
            level: 1,
            parentId: null,
            children: 0
          });
        } else {
          setDataFromAPI(dataFromServer);
        }
      } catch (error) {
        console.error("Ошибка при получении всех строк ", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setDataForRender(convertDataForRender(dataFromAPI));
  }, [dataFromAPI]);

  const handleCreate = (newRow: ConstructionRowRender) => {
    setDataForRender((prev) => [...prev, newRow]);
  };

  const handleDeleteNewRow = (newRowId: number | null) => {
    setDataForRender((prev) => prev.filter((row) => row.id !== newRowId));
  };

  const handleSubmitNewRow = async (newRow: ConstructionRowRender) => {
    try {
      const { current, changed } = await createConstructionCostAPI(newRow);

      let withNewRow;
      if (newRow.parentId === null) {
        // Если у новой строки нет родителя, добавляем ее на верхний уровень
        withNewRow = [
          ...dataFromAPI,
          {
            ...current,
            child: [], // У новой строки нет детей
          },
        ];
      } else {
        // Иначе добавляем новую строку к родителю
        withNewRow = addNewRowToParent(dataFromAPI, {
          ...current,
          parentId: newRow.parentId,
          level: newRow.level,
          children: 0
        });
      }

      if (changed.length) {
        const updated = updateData(withNewRow, [...changed]);
        setDataFromAPI(updated);
        setDataForRender(convertDataForRender(updated));
      } else {
        setDataFromAPI(withNewRow);
        setDataForRender(convertDataForRender(withNewRow));
      }
    } catch (err) {
      console.log("Ошибка во время создания строки ", err);
    }
  };

  const handleUpdate = async (updatedData: ConstructionRowRender) => {
    try {
      const { current, changed } = await updateConstructionCostAPI(updatedData);
      const updated = updateData(dataFromAPI, [current, ...changed]);
      setDataFromAPI(updated);
    } catch (err) {
      console.log("Ошибка во время обновления строки ", err);
    }
  };

  const handleDelete = async (deletedRow: ConstructionRowRender) => {
    if (deletedRow.id === -1) {
      setDataForRender(dataForRender.filter((row) => row.id !== deletedRow.id));
      return;
    }
    try {
      const { changed } = await deleteConstructionCostAPI(deletedRow);
      let updated = deleteRow(dataFromAPI, deletedRow.id);
      if (changed) {
        updated = updateData(updated, [...changed]);
      }
      setDataFromAPI(updated);

      if (updated.length === 0) {
        // если нет данных, то создаем пустую строку
        handleCreate({
          id: -1, // ID заглушка, потом получим нормальный от сервера
          rowName: "",
          salary: 0,
          equipmentCosts: 0,
          overheads: 0,
          estimatedProfit: 0,
          level: 1,
          parentId: null,
          children: 0
        });
      }
    } catch (err) {
      console.log("Ошибка во время удаления строки ", err);
    }
  };

  return (
    dataForRender && (
      <Table
        columns={columns}
        data={dataForRender}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onCreate={handleCreate}
        onSubmit={handleSubmitNewRow}
        onCancelNewRow={handleDeleteNewRow}
      />
    )
  );
}

export default ConstructionTable;
