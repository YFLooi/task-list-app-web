export function getCookieValues() {
  // Chk if token stored on page load
  const cookieArray = decodeURIComponent(document.cookie).split("; ");
  let currentCookies = {
    token: "",
  };
  for (const cookie of cookieArray) {
    if (cookie.includes("token")) {
      const tokenValue = cookie.split("=")[1];
      console.log(`Current cookieArray`);
      console.log(JSON.stringify(cookieArray, null, 2));

      if (!["undefined", "null"].includes(tokenValue)) {
        currentCookies.token = tokenValue;
      }
    }
  }

  return currentCookies;
}
