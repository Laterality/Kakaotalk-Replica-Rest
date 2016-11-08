// let express = require("express");
// let path = require("path");
// let favicon = require("serve-favicon");
// let logger = require("morgan");
// let cookieParser = require("cookie-parser");
// let bodyParser = require("body-parser");

// let routes = require("./routes/index");
// let users = require("./routes/users");
import * as express from "express";
import * as path from "path";
import * as favicon from "serve-favicon";
import * as logger from "morgan";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";

import * as rest from "./routes/rest";

export let app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use("/", routes);
// app.use("/users", users);
app.use("/api", rest.router);

// catch 404 and forward to error handler
app.use(function (req, res, next)
{
	let err = new global.Error("Not Found");
	err["status"] = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
	app.use(function (err, req, res, next) : void
	{
		res["status"](err["status"] || 500);
		res["render"]("error", {
			message: err["message"],
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next)
{
	res["status"](err["status"] || 500);
	res["render"]("error", {
		message: err["message"],
		error: {}
	});
});
