import axios from 'axios';

export const GithubApi = (token) => {
  const ax = axios.create({
    baseURL: 'https://api.github.com/',
    timeout: 5000,
    headers: { 'Authorization': `token ${token}` }
  });

  return {
    usernameExists: async (username) => {
      try {
        // just a head so it'll be quick
        await ax.head(`users/${username}`);
        // and if we don't error out, we know it's gucci
        return true
      } catch (err) {
        // otherwise no good
        return false;
      }
    },
  }
}
