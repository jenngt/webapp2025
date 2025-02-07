//frontend functions to run aka client side script

const jose = window.jose; //Fetching function from the public librarby to load in my window

const urlParams = new URLSearchParams(window.location.search); //Collect "callback url full queries parameters data" for token endpoint
const myParam = urlParams.get("code"); //Filter out only on the "callback url code="

// Your client ID [CHATGPT]
const clientId = "btKmtZ8DAU8NZlK0FSVwNayGI93ou7fO";

// Function to get the appropriate signing key from JWKS based on the key ID (kid) [CHATGPT]
function getSigningKey(jwks, kid) {
  // getSigningKey is to help to collecting signing key from JWKS
  const keys = jwks.keys; //Assign variables into the const keys
  const signingKey = keys.find((key) => key.kid === kid); //The main function to find and locate the SigningKey
  if (!signingKey) {
    throw new Error("Signing key not found in JWKS"); //If found SigningKey then show me error code
  }
  return signingKey; //If found SigningKey give me the answer
}

//Function to decrypt the token on how to display NRIC on frontend
async function decryptToken(token) {
  //From line24h onwards is to decipher the id_token retrieve from Singpass api aka gibberish text
  //Define decrypt token function for NRIC display
  const jwks = {
    keys: [
      //Token collected will be encrypted so need the key to decrypt it
      //I've provided private key in DPP app, once Singpass api return me id_token gibberish text, I must use my private key to decrypt
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
  const alg = "ECDH-ES+A128KW"; //Using the same algorithm to decrypt token
  const privateKey = getSigningKey(jwks, "jenn_testapp_encryption"); //This is my private key to decrypt
  const pk = await jose.importJWK(privateKey, alg); //Run function to read my private key for decryption
  const idToken = token["id_token"]; //Singpass api had returned me 3 tokens;access_token, id_token, signature_token, this function is just to retrieve the id_token only.
  const decoded = await jose.compactDecrypt(
    //Call the decode function using my private key from gibberish to readable text
    idToken,
    pk
  );
  const body = new TextDecoder().decode(decoded.plaintext); //Decipher the data into readable text
  let nricresult = await jose.decodeJwt(body); //After decoded, collect the NRIC only from line 56 to 58.
  console.log(nricresult);
  const [sid] = nricresult.sub.split(","); // After deciphered to read the sid = Singpass ID. [ ] is for deconstruction
  return sid.substring(sid.indexOf("=") + 1, sid.length); //Return data
}

// Generate the client assertion [CHATGPT]
async function generateClientAssertion() {
  try {
    const jwks = {
      //Prepare to call the api, to call api requires a format or data to pull to prove your identity
      keys: [
        {
          kty: "EC",
          d: "FruMBGXk--M4LlzVXs75Bu1Si5UsS3_KLeF1rt5qyhc", //This is a fake private key generated
          crv: "P-256",
          kid: "jenn_testapp_signing",
          x: "AJaI5TTOgMgfqCtmWoFhyt_RzYG-YCGznVXLzQRpwBo",
          y: "Vmdeb67y_Ec3Dd_xHAr8LRfkYkOLQDd2pv6aBfa15YE",
        },
        {
          kty: "EC",
          d: "JNj_Al7iSN6oX5gnuomwBri7eg016X8s4sz96c4hxCk", //This is a fake private key generated
          use: "enc",
          crv: "P-256",
          kid: "jenn_testapp_encryption",
          x: "HARmytlvaPs6qdlh03_q5Jw37QUE-L9ttIMEmL4puYQ",
          y: "5s4pppn1OlWvC5Yh3dvErLuZeRgZgqLKcMFarQIeNjE",
          alg: "ECDH-ES+A128KW",
        },
      ],
    };

    const alg = "ES256"; //Declare my alogrithm

    const signingKey = await getSigningKey(jwks, "jenn_testapp_signing"); // Call the function to get the Signingkey
    const pk = await jose.importJWK(signingKey, alg); //pk = privateKey a function to get PrivateKey
    const clientAssertion = await new jose.SignJWT( //Function to generate the SigningKey which is the client assertion [Delcare ClientAssertion first, very impt line pls do not delete]
      //declare variables to store signing key, following codes are the functions to run...
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

    const postData = {
      //Declaration of payload is a set of data to be sent to Singpass api for authentication to prove my identity and retrieve the id_token
      client_id: "btKmtZ8DAU8NZlK0FSVwNayGI93ou7fO",
      redirect_uri: "https://jennlimwebapp.netlify.app/callback",
      grant_type: "authorization_code",
      code: myParam,
      client_assertion_type:
        "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
      client_assertion: clientAssertion, //referencing ClientAssertion at line96 [very impt line pls do not delete]
    };

    //Declaration of payload is a set of data to be sent to Singpass api for authentication to prove my identity and retrieve the id_token
    //Change it to URL format
    const params = new URLSearchParams(postData);
    const data = await fetch(`/.netlify/functions/index?${params.toString()}`);
    const tokenData = await data.json();

    const nric = await decryptToken(tokenData.data); //Function to decrypt token of the return data is to call line23
    document.querySelector("#nric").innerHTML = `Hello, ${nric}`; //How to take return data and display in HTML on frontend
  } catch (error) {
    console.error("Error generating client assertion:", error); //Display if there's any errors
  }
}

generateClientAssertion(); //Execute the whole generateClientAssertion script
