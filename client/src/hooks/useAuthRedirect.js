import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const useAuthRedirect = ({ redirectIfAuth = false, redirectIfVerified = false }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
        try {
          const res = await axios.get('http://localhost:5000/api/auth/is-auth', {
            withCredentials: true
          });
      
          if (res.data.success) {
            const isVerified = res.data.isVerified;
      
            if (redirectIfVerified && isVerified) {
              navigate('/');
            }
      
            if (redirectIfAuth) {
              navigate('/');
            }
          }
        } catch (err) {
          // not logged in, do nothing
        }
      };
      

    checkAuth();
  }, [navigate, redirectIfAuth, redirectIfVerified]);
};

export default useAuthRedirect;
