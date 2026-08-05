import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@components';
import { OrderInfo } from '@components';

export const OrderModal: FC = () => {
  const navigate = useNavigate();
  return (
    <Modal title='' onClose={() => navigate(-1)}>
      <OrderInfo isModal />
    </Modal>
  );
};
