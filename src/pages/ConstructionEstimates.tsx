import { ReactElement } from 'react';
import style from './ConstructionEstimates.style.scss';
import Header from '../components/Header/Header';
import Aside from '../components/Aside/Aside';

function ConstructionEstimates(): ReactElement {
  return (
    <section className={style.constructionEstimates}>
      <Header />
      <Aside />
    </section>
  )
}

export default ConstructionEstimates;
