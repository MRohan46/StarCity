import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useUserData = ({ check, redirect, onSuccess }) => {
  const navigate = useNavigate();
  const host = "https://api.starcityrp.com";
  //const host = "http://localhost:5000";

  useEffect(() => {
    let isMounted = true;

    const getUserData = async () => {
      try {
        const res = await axios.get(`${host}/api/user/data`, { withCredentials: true });

        if (!isMounted) return;

        if (res.data.success) {
          // Call onSuccess callback if provided
          if (onSuccess) onSuccess(res.data.user);

          if (check === 'verified' && res.data.user.isVerified) {
            navigate(redirect);
          } else if (check === 'auth' && res.data.success) {
            navigate(redirect);
          }
        }
      } catch (err) {
        if (!isMounted) return;

        if (check === 'auth') {
          navigate(redirect);
        }
      }
    };

    getUserData();

    return () => { isMounted = false; };
  }, [check, redirect]); // ✅ No navigate/onSuccess in deps to avoid infinite loop
};

export default useUserData;
