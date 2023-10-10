// src/app.js

import { Auth, getUser } from './auth';

async function init() {
  // Get our UI elements
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');
  const fragmentText = document.querySelector('#fragmentText');
  const createFragmentBtn = document.querySelector('#createFragment');

  // Wire up event handlers to deal with login and logout.
  loginBtn.onclick = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    Auth.federatedSignIn();
  };
  logoutBtn.onclick = () => {
    // Sign-out of the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-out
    Auth.signOut();
  };

  // See if we're signed in (i.e., we'll have a `user` object)
  const user = await getUser();
  if (!user) {
    // Disable the Logout button
    logoutBtn.disabled = true;
    return;
  }

  // Wire up the event handler for the "Create Fragment" button
  createFragmentBtn.onclick = async () => {
    const text = fragmentText.value.trim();
    const cognitoUser = await Auth.currentAuthenticatedUser();
    const idToken = cognitoUser.signInUserSession.idToken.jwtToken;


    if (text) {
      try {
  const response = await fetch(`${process.env.API_URL}/v1/fragments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      'Authorization': `Bearer ${idToken}`, // Include the Cognito token here
    },
    body: text,
  });

        if (response.status === 201) {
          // Fragment created successfully
          alert('Fragment created successfully');
          // You can add more logic here, such as clearing the input field
        } else {
          // Handle other response statuses as needed
          alert('Failed to create fragment');
        }
      } catch (error) {
        console.error('Error creating fragment:', error);
        alert('An error occurred while creating the fragment');
      }
    } else {
      alert('Please enter fragment text');
    }
  };

  // Log the user info for debugging purposes
  console.log({ user });

  // Update the UI to welcome the user
  userSection.hidden = false;

  // Show the user's username
  userSection.querySelector('.username').innerText = user.username;

  // Disable the Login button
  loginBtn.disabled = true;
}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);