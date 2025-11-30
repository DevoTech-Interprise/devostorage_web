import { useAuth } from './useAuth';

export const useRole = () => {
  const { user } = useAuth();

  const isAdmin = user?.tipo === 'administrador';
  const isEmployee = user?.tipo === 'funcionario';

  return {
    isAdmin,
    isEmployee,
    userType: user?.tipo || null,
  };
};

export default useRole;
