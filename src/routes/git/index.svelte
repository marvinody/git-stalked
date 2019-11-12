<script>
  import _ from "lodash";
  import axios from "axios";
  let name = "";
  let counter = 0;
  let exists = false;

  $: loading = counter !== 0;
  $: notBlank = name !== "";
  $: gucci = !loading && exists;
  $: notGucci = !loading && !exists && notBlank;
  const ontype = _.debounce(async () => {
    counter++;
    try {
      // just a head so it'll be quick
      await axios.head(`https://api.github.com/users/${name}`);
      // and if we don't error out, we know it's gucci
      exists = true;
    } catch (err) {
      // otherwise no good
      exists = false;
    } finally {
      counter--;
    }
  }, 500);
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
  }
  .loading,
  .gucci,
  .notGucci {
    display: inline-block;
  }
</style>

<svelte:head>
  <title>Git Analysis</title>
</svelte:head>

<h1>Git Analysis</h1>

<div class="container">
  <span>
    <label for="username">Username:</label>
    <input bind:value={name} name="username" on:keypress={ontype} />
  </span>
  <span class="lds-dual-ring hide" class:loading />
  <span class:gucci class="hide">Gucci</span>
  <span class:notGucci class="hide">Not Gucci</span>
</div>
