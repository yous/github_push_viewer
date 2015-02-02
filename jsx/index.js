var CommitMsg=React.createClass({
	'render': function(){
		var msg=this.props.msg.trim().split('\n')
		if(msg.length===1) return (<span className='commit_head'>{msg[0]}</span>)
		var arr=[], h=msg.shift()
		while(msg[0].trim()==='') msg.shift()
		msg.forEach(function(v){arr.push(v, <br />)})
		arr.pop()
		return (
			<details>
				<summary className='commit_head'>{h}</summary>
				<p>{arr}</p>
			</details>
		)
	}
})
var Commit=React.createClass({
	'render': function(){
		var c=this.props.cm
		return (
			<li>
				<a className='sha' href={'https://github.com/'+this.props.repo+'/commit/'+c.sha}>{c.sha.substring(0, 10)}</a>
				{"  "}
				<CommitMsg msg={c.message} />
			</li>
		)
	}
})
var Push=React.createClass({
	'render': function(){
		var v=this.props.o, user=v.actor, repo=v.repo
		return (
			<li className='push'>
				<img className='user_icon' src={user.avatar_url} />
				<span className='explain'>
					<a className='login' href={'https://github.com/'+user.login}>{user.login}</a>
					{" pushed to "}
					<a className='repo' href={'https://github.com/'+repo.name}>{repo.name.replace(new RegExp('^'+user.login+'/'), '/')}</a>
				</span>
				<span className='body'>
					<ul>{v.payload.commits.map(function(c){return <Commit cm={c} repo={repo.name} />})}</ul>
				</span>
				<time datetime={v.created_at} />
			</li>
		)
	}
})
var Activity=React.createClass({
	'render': function(){
		return (<ul id='activity'>{this.state.data.map(function(v){return <Push o={v} />})}</ul>)
	},
	'getInitialState': function(){
		return {'data': this.props.data}
	}
})
React.render(<Activity data={data}/>, document.getElementById('main'))
