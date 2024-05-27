// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';

// project import
import Profile from './Profile';
import MobileSection from './MobileSection';

// project import
import { GithubOutlined } from '@ant-design/icons';

// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}
      <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
        <Profile />
        {downLG && <MobileSection />}
      </Box>
    </Box>
  );
}
