import * as mongoose from "mongoose";
import * as express from "express";
import * as async from "async";

import * as schemas from "../db_model";
import * as util from "./util";

let User = mongoose.model("User", schemas.UserSchema);
let Chatroom = mongoose.model("Chatroom", schemas.ChatroomSchema);


(<any>mongoose).Promise = global.Promise;


/**
 * 채팅방 생성 API
 * 
 * Path : /api/chatroom
 * Method : POST
 * 
 * Request
 * @body.members : array<string>, 구성원의 id 배열
 * @body.title : string, 채팅방 이름
 * 
 * Response
 * @body.result : string, 처리 결과["success", "error"]
 * @body.chatroom : 생성된 채팅방 정보
 */
export function createChatroom(req : express.Request, res : express.Response) : void
{
	let title = req.body["title"];
	let members : Array<string> = req.body["member"];
	let result = {};


	if (!title || !members)
	{
		result["result"] = "error";
		result["message"] = "some field is empty";
		return util.responseWithJson(req, res, result, 200);
	}

	let newChatroom = new Chatroom(
		{
			title : title,
			members : members
		}
	);

	newChatroom.save()
	.then((_result) =>
	{
		result["result"] = "success";
		result["chatroom"] = _result;
		async.eachSeries(members,
		(id : string, callback : any) =>
			{
				User.findByIdAndUpdate(id,
				{
					$push :
					{
						chatrooms : _result._id
					}
				})
				.then((__result) => {callback(null, __result); },
				(__err) =>
				{
					console.log("push chatroom id into user error\n", __err);
					callback(__err);
				});
			},
			(___err) =>
			{
				if (___err)
				{
					console.log("async error\n", ___err);
					result["result"] = "error";
					result["error"] = ___err;
					return util.responseWithJson(req, res, result, 500);
				}
				return util.responseWithJson(req, res, result, 200);
			});
	}, (_err) =>
	{
		console.log("save chatroom error\n", _err);
		result["result"] = "error";
		result["error"] = _err;
		return util.responseWithJson(req, res, result, 500);
	});
}

/**
 * 채팅방 조회 API
 * 
 * Path : /api/chatroom/{id}
 * Method : GET
 * 
 * Request
 * @param.id : string, 조회할 채팅방 id
 * 
 * Response
 * @body.result : string, 처리 결과["success", "error"]
 * @body.chatroom : 생성된 채팅방 정보
 */
export function retrieveChatroom(req : express.Request, res : express.Response)
{
	let chatroom_id = req.params["param"];
	let result = {};
	Chatroom.findById(chatroom_id)
	.populate("members")
	.then((_result) =>
	{
		if (!_result)
		{
			result["result"] = "not found";
			return util.responseWithJson(req, res, result, 200);
		}

		result["result"] = "success";
		result["chatroom"] = _result;
		util.responseWithJson(req, res, result, 200);
	}, (_err) =>
	{
		console.log("find chatroom error\n", _err);
		result["result"] = "error";
		result["error"] = _err;
		util.responseWithJson(req, res, result, 500);
	});
}