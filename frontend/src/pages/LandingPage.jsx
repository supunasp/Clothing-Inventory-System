import { useAuth } from "../context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import ProductDashboard from "./ProductDashboard";
import { ROLE_ADMIN } from "../constants";

const LandingPage = () => {
    const { user } = useAuth();

    if (user?.role === ROLE_ADMIN) {
        return <AdminDashboard />;
    }

    return <ProductDashboard />;
};

export default LandingPage;