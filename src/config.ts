export let config =
{
	privateKey : "/etc/letsencrypt/live/latera.kr/privkey.pem",
	certificate : "/etc/letsencrypt/live/latera.kr/cert.pem",
	port : 2556,
	db :
	{
		url : "mongodb://localhost:27017/kr",
		options :
		{
			user : "admin_kr",
			pass : "testament"
		}
	}
};
