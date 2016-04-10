/**
 @api {POST} /lesson/create 01. create lesson
 @apiName create lesson
 @apiGroup Lesson
 @apiHeader {String} X-AUTH User access key
 @apiDescription Create new lesson
 @apiParam {String} title lesson title.
 @apiParam {String} description lesson description.
 @apiParam {String} [begin_file_name] lesson beginning file name.
 @apiParam {String} [finish_file_name] lesson finish file name.
 @apiParam {String} [vdo_id] lesson video tutorial.
 @apiParam {String} lesson_category_id lesson category id.
 @apiParamExample {json} Request-Example:
 {
     "title": "Beginning MsWord",
     "description": "Start Word 2010"
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
