var express=require('express'),
	morgan=require('morgan'),
	jade=require('jade'),
	sjc=require(__dirname+'/sjc.js'),
	request=require('request'),
	config=require(__dirname+'/config.json')

const githubapi='https://api.github.com/'

var SUPER='/_/'
var app=express()
	.use(morgan('dev'))
	.set('port', process.env.PORT|6974)
	.use(SUPER, sjc)

app.get('/', function(req, res){
	get('user/following', afterGetFollowing(res))
})
app.get(/^\/([a-z-]+)/i, function(req, res){
	get('users/'+req.params[0]+'/following', afterGetFollowing(res))
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
			'User-Agent': config.appname,
			'Authorization': 'token '+config.token
		}
	}, callback)
}

function afterGetFollowing(res){
	return function(e, r, d){
		if(!(d instanceof Array)){
			if(typeof d.message==='string' && d.message.toLowerCase()==='not found') res.sendStatus(404).end()
			else res.sendStatus(500).end()
			return
		}
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
	}
}
