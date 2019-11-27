import axios from 'axios'
import { exec } from 'child-process-promise'
import { Email, Repo } from '../../../db'
const GIT_ERROR_MSG = 'Invalid repo or user (or insufficient permissions)'
const SQL_ERROR_MSG = 'Oops, something broke! try again later'

const is_valid_repo = async (user, repo) => {
  try {
    await axios.head(`https://github.com/${user}/${repo}`)
    return true
  } catch (err) {
    return false
  }
}

const get_emails_from_repo = async (repo_path) => {
  const delim = ' - '
  const cmd = await exec(`cd ${repo_path} && git log --pretty=format:"%an${delim}%ae" | sort | uniq`)
  if (cmd.stderr) throw cmd.stderr

  const emails = cmd.stdout
    .trim()
    .split('\n')
    .map(line => {
      const [name, email] = line.split(delim)
      return { name, email }
    })

  return emails
}

const download_repo = (user, repo, repo_path) => {
  return exec(`git clone --bare https://github.com/${user}/${repo} ${repo_path}`)
}

const mktemp_dir = async () => {
  const { stdout: dir } = await exec(`mktemp --directory`)
  return dir.trim()
}

const remove_repo = (repo_path) => {
  return exec(`rm -rf ${repo_path}`)
}

const send_new_emails = async (user, repo, res) => {
  const repo_path = await mktemp_dir()
  try {
    if (!await is_valid_repo(user, repo.name)) {
      throw new Error('404')
    }
    await download_repo(user, repo.name, repo_path)

    const raw_emails = await get_emails_from_repo(repo_path)

    const emails = await Email.bulkCreate(raw_emails)
    repo.setEmails(emails)

    res.json(raw_emails)
  } catch (err) {
    console.error(err)
    res.status(404).send(GIT_ERROR_MSG)
  } finally {
    remove_repo(repo_path)
  }
}

export async function get(req, res) {
  const { user, repo: repo_name } = req.params
  if (user.includes('.') || user.includes('/')) {
    res.status(403).send(GIT_ERROR_MSG)
    return
  }

  if (repo_name.includes('.') || repo_name.includes('/')) {
    res.status(403).send(GIT_ERROR_MSG)
    return
  }
  try {
    const [repo, created] = await Repo.findOrCreate({
      where: {
        user, name: repo_name,
      },
    })

    // did it exist before? Maybe just return the emails we have already
    if (!created) {
      const emails = await repo.getEmails()
      res.json(emails.map(email => ({
        name: email.name,
        email: email.email,
      })))
      return
    }
    // if it hasn't existed, continue and fetch new stuff
    send_new_emails(user, repo, res)

  } catch (err) {
    console.error(err)
    res.status(500).end(SQL_ERROR_MSG)
  }

}

