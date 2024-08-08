import { ReactElement } from 'react';
import style from './ConstructionEstimates.style.scss';
import Header from '../components/Header/Header';
import Aside from '../components/Aside/Aside';
import ConstructionTable from '../components/ConstructionTable/ConstructionTable';
import MainLayout from '../components/MainLayout/MainLayout';

function ConstructionEstimates(): ReactElement {
  return (
    <section className={style.constructionEstimates}>
      <Header />
      <MainLayout>
        <Aside />
        <ConstructionTable />
      </MainLayout>
    </section>
  )
}

export default ConstructionEstimates;
