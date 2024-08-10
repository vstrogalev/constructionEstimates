import {
  ReactElement,
  useState,
  ChangeEvent,
  KeyboardEvent,
  FormEvent,
} from "react";
import clsx from "clsx";
import style from "./Table.style.scss";
import { ConstructionRowRender } from "../ConstructionTable/ConstructionTable.types";
import NodeIcon from "../../assets/icons/table_node.svg";
import NodeDeleteIcon from "../../assets/icons/table_node_delete.svg";
import formatNumber from "../../common/utils/formatNumber";

type TableProps = {
  columns: string[];
  data: ConstructionRowRender[];
  onUpdate: (updatedData: ConstructionRowRender) => void;
  onDelete: (deleteRow: ConstructionRowRender) => void;
  onCreate: (createRow: ConstructionRowRender) => void;
  onSubmit: (newRow: ConstructionRowRender) => void;
  onCancelNewRow: (newRowId: number | null) => void;
};

function countDescendants(
  data: ConstructionRowRender[],
  row: ConstructionRowRender
): number {
  let count = 0;
  let children = data.filter((el) => el.parentId === row.id);
  if (!children.length) {
    return count;
  } else {
    return (
      children.length +
      children.reduce((acc, el) => acc + countDescendants(data, el), 0)
    );
  }
}

function Table(props: TableProps): ReactElement {
  // здесь храним id строки, которая редактируется или null если вообще ничего не редактируем
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  // здесь храним измененные поля строки, чтобы потом по сабмиту их обновить в строке
  const [editingRowValues, setEditingRowValues] = useState<
    Partial<ConstructionRowRender>
  >({});
  const [originalRowValues, setOriginalRowValues] = useState<
    Partial<ConstructionRowRender>
  >({});

  const handleDoubleClick = (row: ConstructionRowRender) => {
    setEditingRowId(row.id);
    setEditingRowValues(row);
    setOriginalRowValues(row); // Save original values
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof ConstructionRowRender
  ) => {
    setEditingRowValues({
      ...editingRowValues,
      [field]: e.target.value,
    });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      cancelEdit(editingRowId);
    }
  };

  // если нажали на Enter, то есть по событию submit
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editingRowId !== null) {
      const row = props.data.find((row) => row.id === editingRowId);
      // если нашли эту строку в массиве, то надо ее обновить
      if (row) {
        const updatedRow = {
          ...row,
          ...editingRowValues,
        };
        // обновим данные в массиве
        updateRow(updatedRow);
      }
    }
  };

  const handleClickDelete = (row: ConstructionRowRender) => {
    if (!row.parentId) return;
    props.onDelete(row);
  };

  const handleClickCreate = (row: ConstructionRowRender) => {
    if (editingRowId) return;

    const newRow: ConstructionRowRender = {
      id: -1,
      rowName: "",
      salary: 0,
      equipmentCosts: 0,
      overheads: 0,
      estimatedProfit: 0,
      level: row.level + 1,
      parentId: row.id,
    };
    setEditingRowValues(newRow);
    setEditingRowId(newRow.id);
    props.onCreate(newRow);
  };

  const updateRow = (updatedRow: ConstructionRowRender) => {
    setEditingRowId(null);
    setEditingRowValues({});

    if (updatedRow.id === -1) {
      props.onCancelNewRow(updatedRow.id);
      props.onSubmit(updatedRow);
    } else {
      props.onUpdate(updatedRow);
    }
  };

  const cancelEdit = (editingRowId: number | null) => {
    setEditingRowId(null);
    setEditingRowValues({});
    props.onCancelNewRow(editingRowId);
  };

  return (
    <section className={style.table}>
      <h3 className={style.table__title}>Строительно-монтажные работы</h3>
      <div className={style.table__container}>
        <table className={style.table__content}>
          <thead>
            <tr>
              {props.columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {props.data.map((row) => {
              const isEditing = editingRowId === row.id;
              
              let lengthLineToChildren = 0;
              if (row.children > 0) {
                const childRows = props.data.filter(
                  (childRow) => childRow.parentId === row.id
                );
                const descendants = countDescendants(props.data, row);
                const lastChild = childRows[childRows.length-1];
                const descendantsLastChild = countDescendants(props.data, lastChild);
                
                lengthLineToChildren = descendants - descendantsLastChild;
              }

              return (
                <tr
                  key={row.id}
                  onDoubleClick={() => handleDoubleClick(row)}
                  onKeyDown={handleKeyDown}
                >
                  <td
                    className={clsx(style.table__node)}
                    style={{ marginLeft: row.level * 20 }}
                  >
                    <div className={style.table__nodeIconBg}></div>
                    {row.parentId !== null && (
                      <div
                        className={clsx(
                          style.table__line,
                          style.table__line_connect
                        )}
                      ></div>
                    )}
                    {row.children > 0 && (
                      <div
                        className={clsx(
                          style.table__line,
                          style.table__line_toChildren
                        )}
                        style={{ height: lengthLineToChildren * 52 }}
                      ></div>
                    )}
                    {row.parentId !== null && (
                      <div
                        className={clsx(
                          style.table__line,
                          style.table__line_toParent
                        )}
                      ></div>
                    )}

                    <div className={style.table__nodeIconBg}></div>
                    <img
                      className={style.table__nodeIcon}
                      src={NodeIcon}
                      onClick={() => handleClickCreate(row)}
                    />
                    <img
                      className={clsx(
                        style.table__nodeIcon,
                        style.table__nodeIconDelete,
                        {
                          [style.table__nodeIconDelete_forbidden]:
                            row.parentId === null,
                        }
                      )}
                      src={NodeDeleteIcon}
                      onClick={() => handleClickDelete(row)}
                    />
                  </td>
                  <td
                    className={clsx(
                      { [style.table_edit]: isEditing },
                      style.table__column
                    )}
                  >
                    {isEditing ? (
                      <form onSubmit={handleSubmit}>
                        <input
                          type="text"
                          value={editingRowValues.rowName ?? ""}
                          onChange={(e) => handleChange(e, "rowName")}
                          autoFocus
                          className={style.table__input}
                        />
                      </form>
                    ) : (
                      row.rowName
                    )}
                  </td>
                  <td
                    className={clsx(
                      { [style.table_edit]: isEditing },
                      style.table__column
                    )}
                  >
                    {isEditing ? (
                      <form onSubmit={handleSubmit}>
                        <input
                          type="text"
                          value={editingRowValues.salary ?? ""}
                          onChange={(e) => handleChange(e, "salary")}
                          className={style.table__input}
                        />
                      </form>
                    ) : (
                      formatNumber(row.salary)
                    )}
                  </td>
                  <td
                    className={clsx(
                      { [style.table_edit]: isEditing },
                      style.table__column
                    )}
                  >
                    {isEditing ? (
                      <form onSubmit={handleSubmit}>
                        <input
                          type="text"
                          value={editingRowValues.equipmentCosts ?? ""}
                          onChange={(e) => handleChange(e, "equipmentCosts")}
                          className={style.table__input}
                        />
                      </form>
                    ) : (
                      formatNumber(row.equipmentCosts)
                    )}
                  </td>
                  <td
                    className={clsx(
                      { [style.table_edit]: isEditing },
                      style.table__column
                    )}
                  >
                    {isEditing ? (
                      <form onSubmit={handleSubmit}>
                        <input
                          type="text"
                          value={editingRowValues.overheads ?? ""}
                          onChange={(e) => handleChange(e, "overheads")}
                          className={style.table__input}
                        />
                      </form>
                    ) : (
                      formatNumber(row.overheads, 2)
                    )}
                  </td>
                  <td
                    className={clsx(
                      { [style.table_edit]: isEditing },
                      style.table__column
                    )}
                  >
                    {isEditing ? (
                      <form onSubmit={handleSubmit}>
                        <input
                          type="text"
                          value={editingRowValues.estimatedProfit ?? ""}
                          onChange={(e) => handleChange(e, "estimatedProfit")}
                          className={style.table__input}
                        />
                      </form>
                    ) : (
                      formatNumber(row.estimatedProfit, 2)
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Table;
