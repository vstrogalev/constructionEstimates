import { ReactElement } from 'react';
import style from './ConstructionEstimates.style.scss';
import Header from '../components/Header/Header';


function ConstructionEstimates(): ReactElement {
  return (
    <section className={style.constructionEstimates}>
      <Header/>
    </section>
  )
}

export default ConstructionEstimates;
