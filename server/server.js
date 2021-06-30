const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();
app.use(cors())
app.use(bodyParser.json())
app.set('port' , process.env.PORT || 3000);

//const URL_SERVIDOR = 'http://localhost:3000'
//const URL_SERVIDOR = 'https://spotify-ser.herokuapp.com'
const URL_SERVIDOR = 'https://spotify-cliente.herokuapp.com'

app.post('/refresh', (req, res) => {
  const refreshToken = req.body.refreshToken  
  const spotifyApi = new SpotifyWebApi({
    redirectUri: URL_SERVIDOR,
    clientId: '8e7fbc4daa5b40f3a2486b16ee6ab66e',
    clientSecret: '0c23221c02a344509508ed5cae7474b1',
    refreshToken
})

spotifyApi.refreshAccessToken().then(
    (data) => {
        res.json({
            accessToken: data.body.accessToken,
            expiresIn: data.body.expiresIn,
        })
    }).catch(err => {
        console.log(err)
        res.sendStatus(400)
    })
})

app.post('/login', (req, res) => {
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: URL_SERVIDOR,
        clientId: '8e7fbc4daa5b40f3a2486b16ee6ab66e',
        clientSecret: '0c23221c02a344509508ed5cae7474b1'
    })

    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        })
    }).catch(err => {
        console.log(err)
        res.sendStatus(400)
    })
})

app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'))
})