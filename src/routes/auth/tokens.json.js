export function get(req, res, next) {
  res.json({
    github: req.session.github_token
  })
}
