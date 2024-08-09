import { ReactElement, useState, ChangeEvent, KeyboardEvent, FormEvent } from "react";
import clsx from "clsx";
import style from "./Table.style.scss";
import { ConstructionRowRender } from "../ConstructionTable/ConstructionTable.types";
import NodeIcon from '../../assets/icons/table_node.svg';
import NodeDeleteIcon from '../../assets/icons/table_node_delete.svg';
import formatNumber from "../../common/utils/formatNumber";

type TableProps = {
  columns: string[];
  data: ConstructionRowRender[];
  onUpdate: (updatedData: ConstructionRowRender) => void; // Callback to update parent component's state
  onDelete: (deleteRow: ConstructionRowRender) => void; // Callback to delete row
  onCreate: (createRow: ConstructionRowRender) => void; // Callback to create row
};

function Table(props: TableProps): ReactElement {
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [editingRowValues, setEditingRowValues] = useState<Partial<ConstructionRowRender>>({});
  const [originalRowValues, setOriginalRowValues] = useState<Partial<ConstructionRowRender>>({});
  const [isEditing, setIsEditing] = useState(false);

  const handleDoubleClick = (row: ConstructionRowRender) => {
    setEditingRowId(row.id);
    setEditingRowValues(row);
    setOriginalRowValues(row); // Save original values
    setIsEditing(true);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, field: keyof ConstructionRowRender) => {
    setEditingRowValues({
      ...editingRowValues,
      [field]: e.target.value,
    });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      cancelEdit();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editingRowId !== null) {
      const row = props.data.find((row) => row.id === editingRowId);
      if (row) {
        const updatedRow = {
          ...row,
          ...editingRowValues
        }
        updateRow(updatedRow);
      }
    }
  };

  const handleClickDelete = (row: ConstructionRowRender) => {
    if (!row.parentId) {console.log(1); return}
    props.onDelete(row)
  }

  const handleClickCreate = (row: ConstructionRowRender) => {
    if (isEditing) return;

    props.onCreate(row);
  }

  const updateRow = (row: ConstructionRowRender) => {
    props.onUpdate(row); // Update parent component's state
    setEditingRowId(null);
  };

  const cancelEdit = () => {
    setEditingRowValues(originalRowValues); // Revert to original values
    setEditingRowId(null);
    setIsEditing(false);
  };

  return (
    <section className={style.table}>
      <h3 className={style.table__title}>Строительно-монтажные работы</h3>
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
            return (
              <tr key={row.id} onDoubleClick={() => handleDoubleClick(row)} onKeyDown={handleKeyDown}>
                <td className={clsx(style.table__node)} style={{marginLeft: row.level * 10}}>
                  <div className={style.table__nodeIconBg}>
                  </div>
                  <img className={style.table__nodeIcon} src={NodeIcon} onClick={() => handleClickCreate(row)}/>
                  <img className={clsx( 
                    style.table__nodeIcon,
                    style.table__nodeIconDelete,
                    {
                      [style.table__nodeIconDelete_forbidden]: row.parentId === null
                    })} src={NodeDeleteIcon} onClick={() => handleClickDelete(row)}/>
                </td>
                <td className={clsx({[style.table_edit]: isEditing}, style.table__column)}>
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
                <td className={clsx({[style.table_edit]: isEditing}, style.table__column)}>
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
                <td className={clsx({[style.table_edit]: isEditing}, style.table__column)}>
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
                <td className={clsx({[style.table_edit]: isEditing}, style.table__column)}>
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
                <td className={clsx({[style.table_edit]: isEditing}, style.table__column)}>
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
    </section>
  );
}

export default Table;
