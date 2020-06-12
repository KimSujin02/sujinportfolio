// Express 기본 모듈 불러오기
var express = require('express')
  , http = require('http')
  , path = require('path');

// Express의 미들웨어 불러오기
var bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , static = require('serve-static')
  , errorHandler = require('errorhandler');

// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

// Session 미들웨어 불러오기
var expressSession = require('express-session');

// 파일 업로드용 미들웨어
var multer = require('multer');
var fs = require('fs');

//클라이언트에서 ajax로 요청 시 CORS(다중 서버 접속) 지원
var cors = require('cors');


// 익스프레스 객체 생성
var app = express();

// 기본 속성 설정
app.set('port', process.env.PORT || 3000);

// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }))

// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())

// public 폴더와 uploads 폴더 오픈
// app.use('/public', static(path.join(__dirname, 'public')));
// app.use('/uploads', static(path.join(__dirname, 'uploads')));
app.use('/', static(path.join(__dirname, 'public')));
app.use('/', static(path.join(__dirname, 'uploads')));


// cookie-parser 설정
app.use(cookieParser());

// 세션 설정
app.use(expressSession({
	secret:'my key',
	resave:true,
	saveUninitialized:true
}));


//클라이언트에서 ajax로 요청 시 CORS(다중 서버 접속) 지원
app.use(cors());


//multer 미들웨어
// 파일 제한 : 10개, 1G
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads')
    },
    filename: function (req, file, callback) {
		var extension = path.extname(file.originalname);
		var basename = path.basename(file.originalname, extension);
		callback(null, basename + Date.now() + extension);
	 }
});

var upload = multer({ 
    storage: storage,
    limits: {
		files: 10,
		fileSize: 1024 * 1024 * 1024
	}
});

// 라우터 사용하여 라우팅 함수 등록
var router = express.Router();

//로그인 함수
router.route('/process/login').post(function(req, res) {
	console.log('/process/login 호출');
	res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
	res.write('<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1">');
	res.write('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">');
	res.write('<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>');
	res.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>');
	res.write('<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>');
	res.write('<div class="container"><h2>로그인 성공</h2>');
	res.write('<hr>');
	res.write('<h4>업로드하는 사진이 있으면 페이지 이동!!!</h4>');
	res.write('<a href=/ class="btn btn-primary btn-sm" value= "Home">홈 화면으로 이동</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
	res.write('<a href=/photo.html class="btn btn-primary btn-sm">파일업로드 페이지로 이동</a></div>');				
	res.end();
});

// 파일 업로드 함수
router.route('/process/photo').post(upload.array('photo', 10), function(req, res) {
	console.log('/process/photo 호출');
	
	try {
		var files = req.files;

		//파일 정보 저장 변수 선언
		var originalname = '',
			filename = '',
			mimetype = '',
			size = 0;
		
		if (Array.isArray(files)) {
	        console.log("파일 갯수 : %d", files.length);
			
			
	        for (var index = 0; index < files.length; index++) {
	        	originalname = files[index].originalname;
	        	filename = files[index].filename;
	        	mimetype = files[index].mimetype;
				size = files[index].size;
				console.dir('업로드 파일 정보')
				console.dir(req.files[index]);
				console.log('현재 파일 정보 : ' + originalname + ', ' + filename + ', '
				+ mimetype + ', ' + size);
	        }
			console.dir('======================')
	        
	    } else { //배열이 없을 경우
	        console.log("파일 갯수 : 1 ");
	    	originalname = files[index].originalname;
	    	filename = files[index].name;
	    	mimetype = files[index].mimetype;
			size = files[index].size;
			console.dir('업로드 파일 정보')
			console.dir(req.files[index]);
			console.log('현재 파일 정보 : ' + originalname + ', ' + filename + ', '
			+ mimetype + ', ' + size);
			console.dir('======================')
	    }
		

		
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1">');
		res.write('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">');
		res.write('<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>');
		res.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>');
		res.write('<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>');
		res.write('<div class="container"><br><h2>파일업로드 성공</h2>');
		res.write('<hr>');
		res.write('<a href=/ class="btn btn-primary btn-sm" value= "Home">홈 화면으로 이동</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
		res.write('<a href=/photo.html class="btn btn-primary btn-sm">또 다른 파일 올리기</a></div>');	
		res.end();
		
	} catch(err) {
		console.dir(err.stack);
	}	
		
});


app.use('/', router);


// 404 에러 페이지
var errorHandler = expressErrorHandler({
    static: {
      '404': './public/404.html'
    }
});

app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );

// Express 서버 시작
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});