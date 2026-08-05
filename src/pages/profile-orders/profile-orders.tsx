import { ProfileOrdersUI } from '@ui-pages';
import { FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { setUserOrders, selectUserOrders } from '@slices';
import { useWebSocket } from '../../hooks/useWebSocket';
import { getWsUrl } from '../../utils/getWsUrl';
import { getCookie } from '../../utils/cookie';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);

  const token = getCookie('accessToken')?.replace('Bearer ', '');

  useWebSocket(`${getWsUrl()}/orders?token=${token}`, (data) => {
    dispatch(setUserOrders(data.orders));
  });

  return <ProfileOrdersUI orders={orders} />;
};
