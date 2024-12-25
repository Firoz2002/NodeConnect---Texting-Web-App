import { Router } from "express";

const router: Router = Router();

import { deleteChats, getChats, saveChat } from "../../controllers/chat-controller";
import { register, login, isAuthenticated, logout } from "../../middlewares/authenticate";
import { getUser, createUser, getUsers, findUser } from "../../controllers/user-controller";
import { createFriendRequest, fetchFriendRequests, updateFriendRequest, getFriends } from "../../controllers/friend-controller";

router.post("/login", login);
router.post("/register", register);
router.delete('/logout', logout);

router.get("/user", getUser);
router.post("/user", createUser);
router.get("/get-users", isAuthenticated, getUsers);
router.get("/find-user", isAuthenticated, findUser);

router.get("/get-friends", isAuthenticated, getFriends);
router.get("/friend-requests", isAuthenticated, fetchFriendRequests);
router.post("/friend-request", isAuthenticated, createFriendRequest);
router.put("/friend-request/:id", isAuthenticated, updateFriendRequest);

router.post("/chat", isAuthenticated, saveChat);
router.get("/chat/:id", isAuthenticated, getChats);
router.delete("/chat/:id", isAuthenticated, deleteChats);


export default router;