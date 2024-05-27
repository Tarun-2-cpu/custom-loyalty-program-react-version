// assets
import { ChromeOutlined, QuestionOutlined } from '@ant-design/icons';

// icons
const icons = {
  ChromeOutlined,
  QuestionOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const support = {
  id: 'support',
  title: 'Pages',
  type: 'group',
  children: [
    {
      id: 'member-dashboard',
      title: 'Member Dashboard',
      type: 'item',
      url: '/member-dashboard',
      icon: icons.ChromeOutlined
    },
    {
      id: 'reedem',
      title: 'Reedem',
      type: 'item',
      url: '/redeem',
      icon: icons.ChromeOutlined,
    },
    {
      id: 'transaction',
      title: 'Transaction',
      type: 'item',
      url: '/transaction',
      icon: icons.ChromeOutlined,
    }
  ]
};

export default support;
