import Cookies from "js-cookie";
import api from "./axios";

export const updateUser = async (email: string, updateData: Record<string, unknown>) => {
  try {
    const adminToken = Cookies.get('adminToken');
    if (!adminToken) throw new Error("Admin Token missing");
    const response = await api.patch(`/admin/users/${email}`, updateData, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};
