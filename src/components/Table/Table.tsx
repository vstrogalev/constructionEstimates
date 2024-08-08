import { ReactElement } from "react";
import style from "./Table.style.scss";
import { TableProps } from "./Table.types";

function Table(props: TableProps): ReactElement {
  return (
    <section className={style.table}>
      <h3 className={style.table__title}>Строительно-монтажные работы</h3>
      <table className={style.table__content}>
        <thead>
          <tr>
            {props.columns.map((column) => {
              return <th key={column}>{column}</th>
            })}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Наименование</td>
            <td>100</td>
            <td>200</td>
            <td>300</td>
            <td>400</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

export default Table;
