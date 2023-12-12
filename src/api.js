// src/api.js

// fragments microservice API
const apiUrl = process.env.API_URL;
// const apiUrl = `http://localhost:8080`
// const apiUrl = 'http://ec2-54-197-19-83.compute-1.amazonaws.com:8080' 

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user) {
  console.log("Requesting user fragments data...", user.idToken);
  try {
    const res = await fetch(`${apiUrl}/v1/fragments?expand=1`, {
      headers: {
        // Include the user's ID Token in the request so we're authorized
        Authorization: `Bearer ${user.idToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log("Got user fragments data", { data });
    return data.fragments;
  } catch (err) {
    console.error("Unable to call GET /v1/fragment", { err });
  }
}

export async function postFragment(
  user,
  textFragment,
  fragmentType = "text/plain"
) {
  console.log("Creating a new fragment");
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      method: "POST",
      headers: {
        // Include the user's ID Token in the request so we're authorized
        Authorization: `Bearer ${user.idToken}`,
        "Content-Type": `${fragmentType}`,
      },
      body: `${textFragment}`,
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log("Successfully created fragment", { data });
    return data.fragment;
  } catch (err) {
    console.error("Unable to call POST /v1/fragment", { err });
    return null;
  }
}



export async function getFragmentDataByExt(user, fragmentId, ext = "txt") {
  console.log("Retrieving data");

  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${fragmentId}${ext}`, {
      headers: {
        // Include the user's ID Token in the request so we're authorized
        Authorization: `Bearer ${user.idToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log("Got user fragments data", { data });
    return data.fragment;
  } catch (err) {
    console.error("Unable to call GET /v1/fragment", { err });
  }
}

export async function putFragment(
  user,
  textFragment,
  fragmentType = "text/plain",
  fragmentId
) {
  console.log("Updating fragment");
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${fragmentId}`, {
      method: "PUT",
      headers: {
        // Include the user's ID Token in the request so we're authorized
        Authorization: `Bearer ${user.idToken}`,
        "Content-Type": `${fragmentType}`,
      },
      body: `${textFragment}`,
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log("Successfully created fragment", { data });
    return data.fragment;
  } catch (err) {
    console.error("Unable to call PUT /v1/fragment", { err });
    return null;
  }
}