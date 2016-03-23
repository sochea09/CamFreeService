/**
 @api {POST} /lesson-category/create 01. create lesson category
 @apiName create lesson category
 @apiGroup Lesson Category
 @apiHeader {String} X-AUTH User access key
 @apiDescription Create new lesson category
 @apiParam {String} title lesson-category title.
 @apiParam {String} description lesson-category description.
 @apiParamExample {json} Request-Example:
 {
     "title": "Learning MsWord",
     "description": "Microsoft Word 2010"
 }
 @apiSuccessExample Success-Response:
 HTTP/1.1 200 OK
 {
     "is_active": 1
     "id": 1
     "title": "Learning MsWord"
     "description": "Microsoft Word 2010"
     "order": 1
     "created_by": 7
     "updated_at": "2016-03-06T07:02:20.000Z"
     "created_at": "2016-03-06T07:02:20.000Z"
 }
 */