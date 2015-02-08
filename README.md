# github_push_viewer
View your Github followings' pushes, in one place.

## Limitations
- [ ] Cannot read more than 30 pushes per user.
- [ ] Heavy slow. (7 sec on my server)

## Installation
1. Go to Github [Settings > Applications > Personal access tokens](https://github.com/settings/applications) and generate a read only token.
2. Add `config.json`:

	```json
	{
		"appname": "YOUR_APPLICATION_NAME_OR_USERNAME",
		"token": "YOUR_TOKEN_HERE"
	}
	```
3. `node app.js` and go to `http://localhost:6974`.
  You can change the port by `PORT=25252 node app.js`.
4. Enjoy!

Also, you can view other person's timeline by `http://localhost:6974/other-person-s-username`
