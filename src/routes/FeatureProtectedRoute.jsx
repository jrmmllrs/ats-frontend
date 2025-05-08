import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import useUserStore from '../context/userStore';
import api from '../services/api';

const FeatureProtectedRoute = ({ feature, element }) => {
  const hasFeature = useUserStore((state) => state.hasFeature);
  const setUser = useUserStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = Cookies.get('token');
        const response = await api.get('/user/getuserinfo', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [setUser]);

  // Show a proper loading indicator while fetching user info
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#008080] border-solid"></div>
      </div>
    );
  }

  // Perform the feature check after loading is complete
  return hasFeature(feature) ? element : <Navigate to="/access-denied" />;
};

export default FeatureProtectedRoute;