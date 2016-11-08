import * as mongoose from "mongoose";
import * as express from "express";

import * as schemas from "../db_model";
import * as util from "./util";

let User = mongoose.model("User", schemas.UserSchema);
let Device = mongoose.model("Device", schemas.DeviceSchema);

(<any>mongoose).Promise = global.Promise;


/**
 * 사용자 로그인 API
 * 
 * Path : /api/user/login
 * Method : POST
 * 
 * Request
 * @body.email : string, 사용자 이메일
 * @body.password : string, 사용자 비밀번호(raw string)
 * 
 * Response
 * @body.result : string, 처리 결과["success", "incorrect", "error"]
 * @body.user : UserSchema, 로그인 성공한 경우 해당 유저 정보
 */
export function authUser(req : express.Request, res : express.Response)
{
	let email = req.body["email"];
	let pw = req.body["password"];
	let result = {};

	email = util.normalizeEmail(email);

	User.findById(email)
	.then((_result) =>
	{
		if (!_result)
		{
			result["result"] = "incorrect";
			return util.responseWithJson(req, res, result, 200);
		}

		util.encrypt(pw, _result["salt"])
		.then((password) =>
		{
			if (password.hpassword === _result["password"])
			{
				// 비밀번호 일치, 로그인 성공
				result["result"] = "success";
				result["user"] =
				{
					email : _result["email"],
					username : _result["username"],
					devices : _result["devices"],
					friends : _result["friends"],
					chatroomts : _result["chatrooms"],
					regdate : _result["regdate"]
				};

				return util.responseWithJson(req, res, result, 200);
			}
			else
			{
				// 비밀번호 불일치, 로그인 실패
				result["result"] = "incorrect";
				return util.responseWithJson(req, res, result, 200);
			}
		});

	});
}