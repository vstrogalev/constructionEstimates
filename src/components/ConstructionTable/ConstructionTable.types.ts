export type ConstructionDataRow = {
  id: number;
  rowName: string;
  total: number;
  salary: number;
  mimExploitation: number;
  machineOperatorSalary: number;
  materials: number;
  mainCosts: number;
  supportCosts: number;
  equipmentCosts: number;
  overheads: number;
  estimatedProfit: number;
  child: ConstructionDataRow[];
};
export type ConstructionData = ConstructionDataRow[];

export type ConstructionRowRender = Pick<
  ConstructionDataRow,
  | "id"
  | "rowName"
  | "salary"
  | "equipmentCosts"
  | "overheads"
  | "estimatedProfit"
> & { level: number; parentId: number | null };

// id строки передаем в запросе, так что тут его нет
export type ConstructionDataUpdateRequest = Omit<
  ConstructionDataRow,
  "id" | "total" | "child"
>;

export type ConstructionDataCreateRequest = ConstructionDataUpdateRequest & {
  parentId: number | null;
};

export type ConstructionDataRowRespose = Omit<ConstructionDataRow, "child">;

export type ConstructionDataUpdateResponse = {
  current: ConstructionDataRowRespose;
  changed: ConstructionDataRowRespose[];
};
