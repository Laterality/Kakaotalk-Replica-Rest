import * as mongoose from "mongoose";
import * as express from "express";

import * as schemas from "../db_model";
import * as util from "./util";

let User = mongoose.model("User", schemas.UserSchema);
let Device = mongoose.model("Device", schemas.DeviceSchema);

(<any>mongoose).Promise = global.Promise;


/**
 * 임시 사용자 등록 API
 * 
 * Path : /api/user
 * Method : POST
 * 
 * Request
 * @body.username : string, 사용자명
 * @body.device_id : string, 디바이스 id
 * 
 * Response
 * @body.result : string, 처리 결과["success", "error"];
 * @body.user : 등록된 사용자 정보
 */
export function createUser(req : express.Request, res : express.Response) : void
{
	let username : string = req.body["username"];
	let device : string = req.body["device_id"];
	let result = {};
	let now = Date.now();


	let newUser : mongoose.Document = new User(
		{
			email : "user" + now + "@latera.kr",
			username : username,
			lastModDate : now,
			devices : [device],
			friends : [],
			chatrooms : []
		}
	);

	newUser.save()
	.then((_result) =>
	{
		Device.findByIdAndUpdate(device, {owner : _result._id})
		.then(
			(__result) =>
			{
				User.findById(_result._id)
				.populate("devices")
				.then(
					(___result) =>
					{
						result["result"] = "success";
						result["user"] = ___result;
						util.responseWithJson(req, res, result, 200);
					},
					(___err) =>
					{
						console.log("db query error\n", ___err);
						result["result"] = "error";
						result["error"] = ___err;
						util.responseWithJson(req, res, result, 500);
					}
				);
			},
			(__err) =>
			{
				console.log("update device error\n", __err);
				result["result"] = "error";
				result["error"] = __err;
				util.responseWithJson(req , res, result, 500);
			}
		);
	}, (_err) =>
	{
		console.log("save temp user error\n", _err);
		result["result"] = "error";
		result["error"] = _err;
		util.responseWithJson(req , res, result, 500);
	});
}

/**
 * 사용자 조회 API
 * 
 * Path : /api/user/{id}
 * Method : GET
 * 
 * Request
 * @param.id : 사용자 id
 * 
 * Response
 * @body.result : string, 처리 결과["success", "not found", "error"]
 * @body.user : UserSchema, 사용자 정보
 */
export function retrieveUser(req : express.Request, res : express.Response)
{
	let result = {};
	let id = req.query["param"];

	User.findById(id)
	.populate("devices")
	.then((_result) =>
	{
		if (!_result)
		{
			result["result"] = "not found";
		}
		else
		{
			result["result"] = "success";
			result["user"] =
			{
				email : _result["email"],
				username : _result["username"]
			};
		}
		util.responseWithJson(req, res, result, 200);
	}, (_err) =>
	{
		console.log("retrieve user error\n", _err);
		result["result"] = "error";
		result["error"] = _err;
	});
}

/**
 * 사용자 등록 API
 * 
 * Path : /api/user
 * Method : PUT
 * 
 * Request
 * @body.user_id : string, 사용자 id
 * @body.email : string, 사용자 이메일
 * @body.password : string, 사용자 비밀번호(raw string)
 * 
 * Response
 * @body.result : string, 처리 결과["success", "duplicate", "fail", error"]
 * @body.user : UserSchema, 등록된 사용자 정보
 */
export function updateUser(req : express.Request, res : express.Response) : void
{
	let email : string = req.body["email"];
	let pw : string = req.body["password"];
	let device : string = req.body["device"];
	let username : string = req.body["username"];
	let result : any = {};

	if (!device)
	{
		result["result"] = "fail";
		result["message"] = "some field is empty";
		return util.responseWithJson(req, res, result, 200);
	}

	email = email ? util.normalizeEmail(email) : null;
	util.encrypt(pw)
	.then((password) =>
	{
		let hpw : util.Password = password;

		User.findOne(
			{
				email : email
			}
		).then((_result) =>
		{
			if (!_result)
			{
				// 이메일 중복 없음, 사용자 생성
				let newUser = new User(
					{
						email : email,
						password : hpw.hpassword,
						salt : hpw.salt,
						username : username
					}
				);

				newUser.save()
				.then((__result) =>
				{
					result["result"] = "success";
					result["user"] = __result;
					util.responseWithJson(req, res, result, 200);
				}, (__err) =>
				{
					console.log("save new user error\n", __err);
					result["result"] = "error";
					result["error"] = __err;
					util.responseWithJson(req, res, result, 500);
				});
			}
			else
			{
				// 중복되는 계정 존재
				result["result"] = "duplicate";
				util.responseWithJson(req, res, result, 200);
			}
		}, (_err) =>
		{
			console.log("find user error\n", _err);
			result["result"] = "error";
			result["error"] = _err;
			util.responseWithJson(req, res, result, 500);
		});
	});
}


// module.exports.createUser = createUser;