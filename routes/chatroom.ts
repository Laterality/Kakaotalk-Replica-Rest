import * as mongoose from "mongoose";
import * as express from "express";

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

	if(!title || !members)
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
}

