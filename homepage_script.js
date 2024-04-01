const btn = document.querySelector(".btn-open");

btn.addEventListener("click", function () {
  var url =
    "https://stg-id.singpass.gov.sg/auth?scope=openid&response_type=code&redirect_uri=https://neon-macaron-12345.netlify.app/callback&nonce=7863ce84-ad96-40e8-992e-09778646eb07&client_id=btKmtZ8DAU8NZlK0FSVwNayGI93ou7fO&state=dGVzdCBzdHJpbmcK";

  window.open(url, "blank");

  console.log("click");
});

const testbtn = document.querySelector("#test");

testbtn.addEventListener("click", async function () {
  console.log("hello");
  const data = await fetch("/.netlify/functions/index");
  console.log(data);
});
