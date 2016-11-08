// let bcrypt = require("bcrypt-nodejs");
import * as expresss from "express";
import * as scrypt from "scrypt-async";
import * as bcrypt from "bcryptjs";

export interface Password
{
	readonly hpassword : string; // hashed password
	readonly salt : string; // salt
}

export function encrypt(password : string, salt? : string ) : Promise<Password>
{
	/**
	 * scrypt('mypassword', 'saltysalt', {
    N: 16384,
    r: 8,
    p: 1,
    dkLen: 16,
    encoding: 'hex'
}, function(derivedKey) {
    console.log(derivedKey); // "5012b74fca8ec8a4a0a62ffdeeee959d" 
});
	 */
	return new Promise<Password>((resolve, reject) =>
	{
		salt = salt ? salt : bcrypt.genSaltSync(16);
		scrypt(password, salt, 16384, 8, 2, 16,
		(derivedKey) =>
		{
			let result : Password =
			{
				hpassword : derivedKey,
				salt : salt
			};
			resolve(result);
		}, "hex");
	});
}

export function responseWithJson(req : expresss.Request, res : expresss.Response, json : any, code : number)
{
	res.type("json");
	res.status(code || 200).send(json);
}

export function normalizeEmail(email : string) : string
{
	email = email.replace("/\s/g", "");
	return email;
}