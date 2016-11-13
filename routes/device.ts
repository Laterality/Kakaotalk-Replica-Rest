import * as mongoose from "mongoose";
import * as express from "express";

import * as schemas from "../db_model";
import * as util from "./util";

let User = mongoose.model("User", schemas.UserSchema);
let Device = mongoose.model("Device", schemas.DeviceSchema);

(<any>mongoose).Promise = global.Promise;

/**
 * 디바이스 등록 API
 * 
 * Path : /api/device
 * Method : POST
 * 
 * Request
 * @body.cc : 국가 코드
 * @body.phone : 사용자 전화번호
 * @body.token : 푸시 메시지 토큰
 * @body.platform : 디바이스의 플랫폼["android", "ios", "windows"]
 * 
 * Response
 * @body.result : 처리 결과["duplicate", "success", "error"]
 * @body.user : 등록된 디바이스 정보
 */
export function createDevice(req : express.Request, res : express.Response) : void
{
	// 동일한 번호를 사용하는 디바이스 있는지 검색
	// 이미 사용중인 번호인 경우 해당 디바이스 정보 반환
	// 없는 경우 새로 생성한 뒤 이를 반환
	let cc : number = req["body"]["cc"];
	let _number : number = req["body"]["phone"];
	let platform : string = req["body"]["platform"].toLowerCase();
	let token : string = req["body"]["token"];
	let result;

	Device.find(
		{
			"number.country" : cc,
			"number._number" : _number
		}
	).then((_result) =>
	{
		if (!_result)
		{
			// 디바이스가 존재하지 않는 경우
			// 디바이스를 새로 등록
			let newDev = new Device(
				{
					owner : null,
					platform : platform,
					token : token,
					number :
					{
						country : cc,
						_number : _number
					}
				}
			);

			newDev.save().then(
				(__result) =>
				{
					result["result"] = "success";
					result["device"] = __result;
					return util.responseWithJson(req, res, result, 200);
				},
				(__err) =>
				{
					result["result"] = "error";
					result["error"] = __err;
					return util.responseWithJson(req, res, result, 500);
				}
			);
		} // device doesn't exist

		// 디바이스가 존재하는 경우
		// 해당 디바이스 정보 반환
		result["result"] = "duplicate";
		result["device"] = _result;
		util.responseWithJson(req, res, result, 200);
	},
	(_err) =>
	{
		console.log("db query error\n", _err);
		result["result"] = "error";
		result["error"] = _err;
		util.responseWithJson(req, res, result, 500);
	});
}


/**
 * 디바이스 갱신 API
 * 
 * Path : /api/device
 * Method : PUT
 * 
 * Request
 * @body.device_id : 디바이스 id
 * @body.user_id : 사용자 id
 * 
 * Response
 * @body.result : 처리 결과["not found", "success", "error"]
 * @body.device : 갱신된 디바이스 정보
 */
export function updateDeviceOwner(req : express.Request, res : express.Response)
{
	let dev_id : string = req["body"]["device_id"];
	let user_id : string = req["body"]["user_id"];
	let result : any;

	Device.findOneAndUpdate(
		{
			_id : dev_id
		},
		{
			owner : user_id
		}
	).then((_result) =>
	{
		if (!_result)
		{
			console.log("device not found");
			result["result"] = "not found";
			result["device"] = _result;
			return util.responseWithJson(req, res, result, 200);
		}
	}, (_err) =>
	{
		console.log("db query error\n", _err);
		result["result"] = "error";
		result["error"] = _err;
	});
}