import axios from 'axios'
import qs from 'qs'

export async function get(req, res, next) {
  try {

    const { data } = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: req.query.code,
    })
    const response = qs.parse(data)
    req.session.github_token = response.access_token
    res.redirect('/auth/tokens.json')
  } catch (err) {
    console.error(err)
    next(err)
  }
}
