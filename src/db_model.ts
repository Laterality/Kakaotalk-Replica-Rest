// let mongoose = require("mongoose");
import * as mongoose from "mongoose";

let Schema = mongoose.Schema;

export let UserSchema = new Schema(
	{
		email :
		{
			type : Schema.Types.String,
			unique : true
		},
		password : {type : Schema.Types.String},
		salt : {type : Schema.Types.String},
		username : {type : Schema.Types.String},
		validity : {type : Schema.Types.Boolean, default : true},
		devices :
		[
			{
			type : Schema.Types.ObjectId,
			ref : "Device"
			}
		],
		favorites :
		[
			{
				type : Schema.Types.ObjectId,
				ref : "User"
			}
		],
		friends :
		[
			{
				type : Schema.Types.ObjectId,
				ref : "User"
			}
		],
		chatrooms :
		[
			{
				type : Schema.Types.ObjectId,
				ref : "Chatroom"
			}
		],
		lastModDate : Schema.Types.Number
	}
);

export let DeviceSchema = new Schema(
	{
		owner :
		{
			type : Schema.Types.ObjectId,
			ref : "User"
		},
		platform :
		{
			type : Schema.Types.String,
			enum : ["android", "ios", "windows"]
		},
		token : Schema.Types.String,
		_number :
		{
			country : Schema.Types.String,
			_number : Schema.Types.String
		},
	}
);

export let ChatroomSchema = new Schema(
	{
		title : {type : Schema.Types.String},
		type : 
		{
			type : Schema.Types.String,
			enum : ["OneOnOne", "Multi"]
		},
		members :
		[
			{
				type : Schema.Types.ObjectId,
				ref : "User"
			}
		]
	}
);

// module.exports.UserSchema = UserSchema;
// module.exports.DeviceSchema = DeviceSchema;
// module.exports.ChatroomSchema = ChatroomSchema;
