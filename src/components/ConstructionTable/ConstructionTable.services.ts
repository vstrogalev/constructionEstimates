import { ConstructionData } from './ConstructionTable.types';

const URL = process.env.REACT_APP_CONSTRUCTION_COSTS_API_URL;
const ENTITY_ID_API = process.env.REACT_APP_ENTITY_ID_API;

if (!URL || !ENTITY_ID_API) {
  console.error('Environment variables are not defined properly:', {
    URL,
    ENTITY_ID_API,
  });
  throw new Error('Environment variables are not defined properly');
}

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

export const getConstructionCostsListAPI = () =>
  fetch(`${URL}/${ENTITY_ID_API}/row/list`)
    .then((res) => checkResponse<ConstructionData>(res))
    .then((data) => {
      if (data.length) return data;
      return Promise.reject(data);
    });

// export const getFeedsApi = () =>
//   fetch(`${URL}/orders/all`)
//     .then((res) => checkResponse<TFeedsResponse>(res))
//     .then((data) => {
//       if (data?.success) return data;
//       return Promise.reject(data);
//     });


// export type TNewOrderResponse = TServerResponse<{
//   order: TOrder;
//   name: string;
// }>;

// export const orderBurgerApi = (data: string[]) =>
//   fetchWithRefresh<TNewOrderResponse>(`${URL}/orders`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json;charset=utf-8',
//       authorization: getCookie('accessToken')
//     } as HeadersInit,
//     body: JSON.stringify({
//       ingredients: data
//     })
//   }).then((data) => {
//     if (data?.success) return data;
//     return Promise.reject(data);
//   });
