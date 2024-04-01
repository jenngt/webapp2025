const jose = window.jose; //Fetching function from public librarby to load in my window

const urlParams = new URLSearchParams(window.location.search); //Collect "callback url full queries parameters data" for token endpoint
const myParam = urlParams.get("code"); //Filter out only on the "callback url code="

// Your client ID
const clientId = "btKmtZ8DAU8NZlK0FSVwNayGI93ou7fO";

// Function to get the appropriate signing key from JWKS based on the key ID (kid) [CHATGPT]
function getSigningKey(jwks, kid) {
  const keys = jwks.keys;
  const signingKey = keys.find((key) => key.kid === kid);
  if (!signingKey) {
    throw new Error("Signing key not found in JWKS");
  }
  return signingKey;
}

//Function to decrypt the token How to display NRIC on frontend
async function decryptToken(token) {
  //Here onwards is to decipher the gibberish text
  //Define decrypt token function for NRIC display
  const jwks = {
    keys: [
      //Token collected will be encrypted so need the key to decrypt it
      {
        kty: "EC",
        d: "FruMBGXk--M4LlzVXs75Bu1Si5UsS3_KLeF1rt5qyhc",
        crv: "P-256",
        kid: "jenn_testapp_signing",
        x: "AJaI5TTOgMgfqCtmWoFhyt_RzYG-YCGznVXLzQRpwBo",
        y: "Vmdeb67y_Ec3Dd_xHAr8LRfkYkOLQDd2pv6aBfa15YE",
      },
      {
        kty: "EC",
        d: "JNj_Al7iSN6oX5gnuomwBri7eg016X8s4sz96c4hxCk",
        use: "enc",
        crv: "P-256",
        kid: "jenn_testapp_encryption",
        x: "HARmytlvaPs6qdlh03_q5Jw37QUE-L9ttIMEmL4puYQ",
        y: "5s4pppn1OlWvC5Yh3dvErLuZeRgZgqLKcMFarQIeNjE",
      },
    ],
  };
  const alg = "ECDH-ES+A128KW"; //Using the same alogorith to decrypt token
  const privateKey = getSigningKey(jwks, "jenn_testapp_encryption"); //This is my private key to decrypt
  console.log(privateKey);
  const pk = await jose.importJWK(privateKey, alg); //Run function to read my private key for decryption
  const idToken = token["id_token"]; //Retrieve decrypt token from decrypt token function at line 32.
  const decoded = await jose.compactDecrypt(
    //Call the decode function using my private key
    idToken,
    pk
  );
  const body = new TextDecoder().decode(decoded.plaintext); //Decipher the data into readable text
  let nricresult = await jose.decodeJwt(body);
  console.log(nricresult);
  const [sid] = nricresult.sub.split(","); // After deciphered to read the sid = Singpass ID. [ ] is for deconstruction
  return sid.substring(sid.indexOf("=") + 1, sid.length); //Return data
}

// Generate the client assertion
async function generateClientAssertion() {
  try {
    const jwks = {
      //Prepare to call the api, to call api requires a format or data to pull to prove your identity
      keys: [
        {
          kty: "EC",
          d: "FruMBGXk--M4LlzVXs75Bu1Si5UsS3_KLeF1rt5qyhc",
          crv: "P-256",
          kid: "jenn_testapp_signing",
          x: "AJaI5TTOgMgfqCtmWoFhyt_RzYG-YCGznVXLzQRpwBo",
          y: "Vmdeb67y_Ec3Dd_xHAr8LRfkYkOLQDd2pv6aBfa15YE",
        },
        {
          kty: "EC",
          d: "JNj_Al7iSN6oX5gnuomwBri7eg016X8s4sz96c4hxCk",
          use: "enc",
          crv: "P-256",
          kid: "jenn_testapp_encryption",
          x: "HARmytlvaPs6qdlh03_q5Jw37QUE-L9ttIMEmL4puYQ",
          y: "5s4pppn1OlWvC5Yh3dvErLuZeRgZgqLKcMFarQIeNjE",
          alg: "ECDH-ES+A128KW",
        },
      ],
    };

    const alg = "ES256";

    const signingKey = await getSigningKey(jwks, "jenn_testapp_signing"); // Replace with the actual key ID
    const pk = await jose.importJWK(signingKey, alg);
    const clientAssertion = await new jose.SignJWT(
      //declare variables to store signing key
      {
        iss: clientId,
        sub: clientId,
        aud: "https://stg-id.singpass.gov.sg",
        exp: Math.floor(Date.now() / 1000) + 120,
        iat: Math.floor(Date.now() / 1000),
      }
    )
      .setProtectedHeader({
        typ: "JWT",
        alg: alg,
        kid: "jenn_testapp_signing",
      })
      .sign(pk);

    console.log(clientAssertion); //variables

    const postData = {
      client_id: "btKmtZ8DAU8NZlK0FSVwNayGI93ou7fO",
      redirect_uri: "https://neon-macaron-12345.netlify.app/callback",
      grant_type: "authorization_code",
      code: myParam,
      client_assertion_type:
        "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
      client_assertion: clientAssertion, //referencing the variables
    };

    // Create the fetch request code from here is to start calling api.
    fetch("https://stg-id.singpass.gov.sg/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", // Specify the content type
      },
      body: new URLSearchParams(postData), // Convert data object to JSON string
    })
      .then((response) => {
        console.log(response);
        // Check if response is successful (status code 200-299)
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // Parse response JSON
        return response.json();
      })
      .then((data) => {
        // Handle response data
        console.log("Response data:", data);
        return data; //Return data
      })
      .then(async (result) => {
        //Decrypt token with the return data
        const nric = await decryptToken(result); //Function to decrypt token of the return data
        document.querySelector("#nric").innerHTML = `Hello, ${nric}`; //How to take return data and display in HTML on frontend
      })
      .catch((error) => {
        // Handle backend errors
        console.error("Error:", error);
      });
  } catch (error) {
    console.error("Error generating client assertion:", error);
  }
}

generateClientAssertion();
