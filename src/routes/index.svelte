<style>
  h1,
  p {
    margin: 0 auto;
  }

  .center {
    text-align: center;
  }

  h1 {
    font-size: 2.8em;
    text-transform: uppercase;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }

  p {
    margin: 1em auto;
    text-align: left;
  }
  ul {
    list-style-type: disclosure-closed;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }
</style>

<svelte:head>
  <title>Sapper project template</title>
</svelte:head>

<h1 class="center">Git Stalked!</h1>

<p class="center">
  <strong>An experiment in being creepy.</strong>
</p>

<p>
  At some point, I realized git commits track an author's emails and then at
  another point I had the idea of being creepy. One night both of these ideas
  together and formed an even worse fused idea. What if you could type in
  someone's name and get their email and anyone else they worked with's email.
  And thus, this was born.
</p>

<p>
  This is a really crude app in the way I did out (source over
  <a href="https://github.com/marvinody/git-stalked">here</a>
  if you're into that sorta thing) but it was pretty fun to make in a more
  Svelte-y way than some of my previous Svelte projects.
</p>

<p>Pretty simple execution:</p>
<ul>
  <li>User enters a username</li>
  <li>Search up public repos owned by that username</li>
  <li>For each repo:</li>
  <ul>
    <li>Download it</li>
    <li>Get all the commits' authors and find only unique entries</li>
  </ul>
  <li>Delete the repo</li>
</ul>
<p>
  All of the above gets cached for each repo for some time so Github doesn't
  yell at me too much.
</p>
<p>
  You might be wondering why Github Oauth is required if it doesn't even allow
  you to see private repos. I don't lookup private repos for privacy concerns
  since it's cached. So why not require it at all? Github has a low limit on
  username search (like 10/min) without auth. So your authentication is to just
  allow you to search up a bunch of people and have nice immediate search on the
  form. That's it. Use a dummy account if you want and nothing will be
  different!
</p>
