import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const HomeButton = () => {
    const navigate = useNavigate();

    return (
        <HomeOutlined 
            style={{ fontSize: '24px', cursor: 'pointer', marginBottom: '10px' , color:'#4a90e2', hover: '#4a90e9'}} 
            onClick={() => navigate('/')} // Navigate to home
        />
    );
};

export default HomeButton;
