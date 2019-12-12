<script>
  import { stores, goto } from "@sapper/app";
  const { session } = stores();

  import _ from "lodash";
  import { GithubApi } from "../../utils";
  let name = "";
  let counter = 0;
  let exists = false;
  let repoEmails = [];
  // boolean true if it exists
  $: loggedIn = !!$session.tokens.github;
  $: loading = counter !== 0;
  $: notBlank = name !== "";
  $: gucci = !loading && exists && notBlank;
  $: notGucci = !loading && !exists && notBlank;
  $: api = GithubApi($session.tokens.github);
  const ontype = _.debounce(async () => {
    counter++;
    exists = await api.usernameExists(name);
    counter--;
  }, 500);

  const stalk = async () => {
    // reset to empty
    repoEmails = [];
    const repos = await api.getRepos(name);
    const emailFetcher = api.getEmails(name);
    name = "";
    repos.forEach(async repo => {
      const emails = await emailFetcher(repo.name);
      repoEmails = [
        ...repoEmails,
        {
          repo,
          emails
        }
      ];
      console.log({ repoEmails });
    });
  };
</script>

<style>
  .hide {
    display: none;
  }
  .lds-dual-ring:after {
    content: " ";
    display: block;
    width: 16px;
    height: 16px;
    margin: 1px;
    border-radius: 50%;
    border: 5px solid #fff;
    border-color: #000 transparent #000 transparent;
    animation: lds-dual-ring 1.2s linear infinite;
  }
  @keyframes lds-dual-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .container {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .loading,
  .gucci,
  .notGucci {
    display: inline-block;
  }
  h1 {
    text-align: center;
  }
</style>

<svelte:head>
  <title>Git Analysis</title>
</svelte:head>

<h1>Git Analysis</h1>

<div class="container">
  <div>
    {#if loggedIn}
      <span>
        <label for="username">Username:</label>
        <input bind:value={name} name="username" on:keypress={ontype} />
      </span>
    {:else}
      <a href="/auth/github">Sign in with Github</a>
    {/if}
    <span class="lds-dual-ring hide" class:loading />
    <span class:gucci class="hide">Gucci</span>
    <span class:notGucci class="hide">Not Gucci</span>
    <button disabled={!exists} class:hide={!loggedIn} on:click={stalk}>
      Stalk Them!
    </button>
  </div>
  <div class:hide={!loggedIn} class="info-container">
    {#each repoEmails as repoEmail}
      <h3>{repoEmail.repo.name}</h3>
      <ul>
        {#each repoEmail.emails as email}
          <li>{email.name} - {email.email}</li>
        {/each}
      </ul>
    {/each}
  </div>
</div>
