import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
    const navigate = useNavigate();

    return (
        <ArrowLeftOutlined 
            style={{ fontSize: '24px', cursor: 'pointer', marginBottom: '10px' }} 
            onClick={() => navigate(-1)} // Go back
        />
    );
};

export default BackButton;
