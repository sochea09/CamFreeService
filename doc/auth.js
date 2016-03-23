/**
 @api {POST} /auth/signin 01. Signin by email & passowrd
 @apiName auth-signin
 @apiGroup Auth
 @apiDescription Register new camfree id
 @apiParam {String} email user email.
 @apiParam {String} password user password.
 @apiParamExample {json} Request-Example:
 {
     "email": "me.sochea@gmail.com",
     "password": "123456"
 }
 @apiSuccessExample Success-Response:
 HTTP/1.1 200 OK
 {
    "id": 7,
    "uid": "me.sochea",
    "hash": "6cf5b230d78d11e58c5755e445bd094a",
    "email": "me.sochea@gmail.com",
    "username": "me.sochea",
    "country_code": null,
    "phone_number": null,
    "password": "DiCnT/jqFEp/DQKmeKMZxNGcObvRpKGHRtqXmTuGfyM=",
    "has_password": true,
    "access_key": "mqrzyCnHMG5A+O4XZ3MVN+4A9+VoRMq5KrnGqm7cqWs=",
    "last_login": "2016-02-20T04:50:12.000Z",
    "is_pw_change": false,
    "role_id": 5,
    "status": "pending",
    "is_email_verified": null,
    "is_phone_verified": null,
    "created_at": "2016-02-20T04:50:12.000Z",
    "updated_at": "2016-02-20T04:50:12.000Z"
 }
 */