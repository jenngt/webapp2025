document.getElementById("postButton").addEventListener("click", function () {
  // Specify the URL of the new page
  const newPageUrl =
    "https://stg-id.singpass.gov.sg/auth?scope=openid&response_type=code&redirect_uri=https://jennlimwebapp.netlify.app/callback&nonce=7863ce84-ad96-40e8-992e-09778646eb07&client_id=btKmtZ8DAU8NZlK0FSVwNayGI93ou7fO&state=dGVzdCBzdHJpbmcK"; // Replace with your desired URL
  // Open the new page
  window.location.href = newPageUrl;
});
