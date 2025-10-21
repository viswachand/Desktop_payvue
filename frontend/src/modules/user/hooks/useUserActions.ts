import { useAppDispatch } from "@/app/hooks";
import { useCallback } from "react";
import { fetchUsers, addUser, updateUser, deleteUser } from "@/features/user/userSlice";
import type { User } from "@payvue/shared/types/user";

export function useUserActions() {
  const dispatch = useAppDispatch();

  const fetchAllUsers = useCallback(() => dispatch(fetchUsers()), [dispatch]);
  const addNewUser = useCallback((data: Partial<User>) => dispatch(addUser(data)), [dispatch]);
  const updateExistingUser = useCallback((id: string, data: Partial<User>) => dispatch(updateUser({ id, data })), [dispatch]);
  const removeUser = useCallback((id: string) => dispatch(deleteUser(id)), [dispatch]);

  return {
    fetchUsers: fetchAllUsers,
    addUser: addNewUser,
    updateUser: updateExistingUser,
    deleteUser: removeUser,
  };
}
