import { ReactElement, useEffect, useState } from "react";
import Table from "../Table/Table";
import { getConstructionCostsListAPI } from "./ConstructionTable.services";
import { ConstructionData } from "./ConstructionTable.types";

const columns = [
  "Уровень",
  "Наименование работ",
  "Основная з/п",
  "Оборудование",
  "Накладные расходы",
  "Сметная прибыль",
];

function ConstructionTable(): ReactElement {
  const [data, setData] = useState<ConstructionData>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const constructionCostsData = await getConstructionCostsListAPI();
        setData(constructionCostsData);
        console.table(data)
      } catch (error) {
        console.error("Failed to fetch construction costs data", error);
      }
    };

    fetchData();
  }, []);

  return <Table columns={columns} data={[]} />;
}

export default ConstructionTable;
