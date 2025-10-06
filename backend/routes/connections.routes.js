import express from "express"
import { protectedRoute } from "../middleware/auth.middleware.js";
import { sendConnectionRequest, acceptConnectionRequest, rejectConnectionRequest, getConnectionRequests, getUserConnections, removeConnection, getConnectionStatus } from "../controller/connections.controller.js";

const router = express.Router();

router.post("/request/:userId", protectedRoute, sendConnectionRequest)
router.put("/accept/:requestId", protectedRoute, acceptConnectionRequest)
router.put("/reject/:requestId", protectedRoute, rejectConnectionRequest)

router.get("/requests", protectedRoute, getConnectionRequests)

router.get("/", protectedRoute, getUserConnections)
router.delete("/:userId", protectedRoute, removeConnection)
router.get("/status/:userId", protectedRoute, getConnectionStatus)


export default router

// 68dccbb36c8e0ed27db24691 user1
// 68dd0a213304e1ea0cefa377 admin1