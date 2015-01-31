var express=require('express'),
	morgan=require('morgan'),
	jade=require('jade'),
	sjc=require(__dirname+'/sjc.js'),
	request=require('request')

const githubapi='https://api.github.com/'
const your_token='YOUR_TOKEN_HERE'

var SUPER='/_/'
var app=express()
	.use(morgan('dev'))
	.set('port', process.env.PORT|6974)
	.use(SUPER, sjc)
app.get('/', function(req, res){
	get('user/following', function(e, r, d){
		var q=[], p=[]
		var arr=d.filter(function(v){return v.type.toLowerCase()==='user'});
		for(var i=0; i<arr.length; ++i) q.push(1)
		arr.forEach(function(v, i){
			get('users/'+v.login+'/events', function(e, r, d){
				q[i]=0
				p=p.concat(d)
				if(q.indexOf(1)===-1) finish()
			})
		})
		function finish(){
			q=null
			render(res, './v/index.jade', {'SUPER': SUPER, 'data': p})
		}
	})
})
app.listen(app.get('port'))

function render(res, path, options){
	res.type('html')
	var html='';
	try{
		html=jade.renderFile(path, options);
	} catch(e){
		console.log(e.message)
		res.sendStatus(500).end()
		return
	}
	res.status(200).send(html).end()
}

function get(api, callback){
	return request.get({
		'url': githubapi+api,
		'json': true,
		'headers': {
			'User-Agent': 'ReadOnly',
			'Authorization': 'token '+your_token
		}
	}, callback)
}
