import { useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const useUserData = ({ onSuccess } = {}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const host = "https://api.starcityrp.com";
  // const host = "http://localhost:5000";

  useEffect(() => {
    let isMounted = true;

    const checkUser = async () => {
      try {
        const res = await axios.get(`${host}/api/user/data`, {
          withCredentials: true,
        });

        if (!isMounted) return;

        const user = res.data?.user;
        const isAuth = !!res.data?.success;
        const isVerified = user?.isVerified;
        const path = location.pathname;

        // 🔥 call onSuccess if defined
        if (isAuth && onSuccess) {
          onSuccess(user);
        }

        // ----------------- Redirect Logic -----------------
        if (!isAuth) {
          if (["/payment", "/paid", "/dashboard", "/logout"].includes(path)) {
            navigate("/login", { replace: true });
          }
        } else {
          if (!isVerified) {
            if (path !== "/email-verify") {
              navigate("/email-verify", { replace: true });
            }
          } else {
            if (["/login", "/signup"].includes(path)) {
              navigate("/", { replace: true });
            }
          }
        }
        // --------------------------------------------------

      } catch (err) {
        if (!isMounted) return;
        if (
          ["/payment", "/paid", "/dashboard", "/logout"].includes(location.pathname)
        ) {
          navigate("/login", { replace: true });
        }
      }
    };

    checkUser();

    return () => {
      isMounted = false;
    };
  }, [location.pathname, navigate, onSuccess]);

};

export default useUserData;
