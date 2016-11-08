import * as express from "express";
import * as multer from "multer";

import * as rest_user from "./user";
import * as rest_device from "./device";
import * as rest_auth from "./auth";

"use strict";

export let router = express.Router();

router
.get("/user/:param", (req : express.Request, res : express.Response) =>
{
	rest_user.retrieveUser(req, res);
})
.post("/user/login", (req : express.Request, res : express.Response) =>
{
	rest_auth.authUser(req, res);
})
.post("/user", (req : express.Request, res : express.Response) =>
{
	rest_user.createUser(req, res);
})
.put("/user", (req : express.Request, res : express.Response) =>
{
	rest_user.updateUser(req, res);
})
.post("/device", (req : express.Request, res : express.Response) =>
{
	rest_device.createDevice(req, res);
})
.put("/device", (req : express.Request, res : express.Response) =>
{
	rest_device.updateDeviceOwner(req, res);
});