import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

/**
 * @author Miracle Boniface
 * @module utils/alert
*/

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

/**
 * @author Miracle Boniface
 * @module utils/alert
 * @function showToast
 * @description Show a toast message to the user
 * @param {string} icon - The icon of the toast alert message success | error | warning | info
 * @param {string} title - The title of the toast alert
 * @export
*/
// Export the Toast instance
export const showToast = (icon: 'success' | 'error' | 'warning' | 'info', title: string) => {
  Toast.fire({
    icon: icon,
    title: title,
  });
};