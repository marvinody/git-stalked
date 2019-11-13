
export function get(req, res, next) {
  const url = 'https://github.com/login/oauth/authorize?' + [
    `client_id=${process.env.GITHUB_CLIENT_ID}`,
    `redirect_uri=${process.env.GITHUB_DEV_REDIRECT}`
  ].join('&')
  res.redirect(url)
}
