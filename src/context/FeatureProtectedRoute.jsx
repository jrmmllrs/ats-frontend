// context/FeatureProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import useUserStore from './userStore';

const FeatureProtectedRoute = ({ feature, element }) => {
  const hasFeature = useUserStore((state) => state.hasFeature);

  return hasFeature(feature) ? element : <Navigate to="/access-denied" />;
};

export default FeatureProtectedRoute;
