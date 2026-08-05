import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  setFeed,
  getFeeds,
  selectFeedOrders,
  selectFeedLoading
} from '@slices';
import { useWebSocket } from '../../hooks/useWebSocket';
import { getWsUrl } from '../../utils/getWsUrl';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const isLoading = useSelector(selectFeedLoading);

  useWebSocket(`${getWsUrl()}/orders/all`, (data) => {
    dispatch(
      setFeed({
        orders: data.orders,
        total: data.total,
        totalToday: data.totalToday
      })
    );
  });

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={() => dispatch(getFeeds())} />;
};
