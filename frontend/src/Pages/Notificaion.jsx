import { useQuery } from "@tanstack/react-query";
import React from "react";
import { axiosInstance } from "../lib/axios";

const Notificaion = () => {
  const { data: user } = useQuery({ queryKey: ["authUser"] });

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/notifications/");
        return res?.data;
      } catch (error) {
        toast.error(error.response.data.msg);
      }
    },
  });

  const {mutation : markAsReadMutation} = useQuery({
    mutation :  
  })

  return <div>Notificaions</div>;
};

export default Notificaion;
