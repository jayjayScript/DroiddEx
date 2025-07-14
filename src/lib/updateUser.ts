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

export const deleteUser = async (userId: string) => {
  try {
    const adminToken = Cookies.get('adminToken');
    if (!adminToken) {
      throw new Error("Admin token is missing. Please log in again.");
    }

    console.log('Attempting to delete user with ID:', userId);
    console.log('Admin token exists:', !!adminToken);

    // Make sure the API instance has the auth header
    const response = await api.delete(`/admin/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Delete response status:', response.status);
    console.log('Delete response data:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};