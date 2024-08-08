enum TypoOfNode {
  root,
  hasChild,
  hasNoChild
}

export type ConstructionDataRow = {
  id: number;
  rowName: string;
  total: number;
  salary: number;
  mimExploitation: number;
  machineOperatorSalary: number,
  materials: number,
  mainCosts: number,
  supportCosts: number,
  equipmentCosts: number,
  overheads: number,
  estimatedProfit: number,
  child: ConstructionDataRow[]
}
export type ConstructionData = ConstructionDataRow[];

export type ConstructionRowRender = Pick<ConstructionDataRow, "id" | "rowName" | "salary" | "equipmentCosts" | "overheads" | "estimatedProfit"> & {typeOfNode: TypoOfNode};

// id строки передаем в запросе, так что тут его нет
export type ConstructionDataUpdateRequest = Omit<ConstructionDataRow, "id" | "total" | "child">;

export type ConstructionDataCreateRequest = ConstructionDataUpdateRequest & {parentId: number | null}

type ConstructionDataRowWOChild = Omit<ConstructionDataRow, "child">;

export type ConstructionDataUpdatRespond = {
  current: ConstructionDataRowWOChild,
  changed: ConstructionDataRowWOChild[]
}
