export default async function (context) {
  const token = context.store.state.ocean_auth_token.token;

  // Query
  const tokenQuery = {
    query: `{ checkAuth }`
  };
  // END Query

  if (token) {
    try {
      await fetch(process.env.graphUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "app-token": token },
        body: JSON.stringify(tokenQuery)
      })
        .then(res => res.json())
        .then(rest => {
          if (rest.data.checkAuth === true) {
            return context.redirect("/");
          }
        });
    } catch (error) { }
  }
}
