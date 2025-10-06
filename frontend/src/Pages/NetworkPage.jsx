import { useQuery } from "@tanstack/react-query";
import React from "react";
import { axiosInstance } from "../lib/axios";

const NetworkPage = () => {
  const { data: user } = useQuery({ queryKey: ["authuser"] });
  const { data : connectionRequests } = useQuery({ queryKey : ["connectionRequests"],
    queryFn : () => {
        axiosInstance.get("/connections/requests")
    }
  })

  console.log(connectionRequests)

  return <div>NetworkPage</div>;
};

export default NetworkPage;
