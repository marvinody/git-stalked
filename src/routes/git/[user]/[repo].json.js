import axios from 'axios'
import { exec } from 'child-process-promise'
const error_message = 'Invalid repo or user (or insufficient permissions)'
export async function get(req, res) {
  const { user, repo } = req.params
  if (user.includes('.') || user.includes('/')) {
    res.statusCode = 403
    res.end(error_message)
    return
  }

  if (repo.includes('.') || repo.includes('/')) {
    res.statusCode = 403
    res.end(error_message)
    return
  }
  // const repo_path = './test'
  const repo_path = await mktemp_dir()
  try {
    if (!await is_valid_repo(user, repo)) {
      throw new Error('404')
    }
    await download_repo(user, repo, repo_path)

    const emails = await get_emails_from_repo(repo_path)

    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(emails))
  } catch (err) {
    res.statusCode = 404
    res.end(error_message)
  } finally {
    remove_repo(repo_path)

  }

}

const is_valid_repo = async (user, repo) => {
  try {
    await axios.head(`https://github.com/${user}/${repo}`)
    return true
  } catch (err) {
    return false
  }
}

const get_emails_from_repo = async (repo_path) => {
  const delim = " - "
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
