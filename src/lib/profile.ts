import api from "./axios";
import Cookies from "js-cookie";

export const updateFullname = (fullname: string) =>
  api.patch(
    "/profile/fullname",
    { fullname },
    {
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    }
  );

export const updateCountry = (country: string) =>
  api.patch(
    "/profile/country",
    { country },
    {
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    }
  );

export const updatePhone = (phone: string) =>
  api.patch(
    "/profile/phone",
    { phone },
    {
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    }
  );

export const updateAddress = (address: string) =>
  api.patch(
    "/profile/address",
    { address },
    {
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    }
  );
