require("dotenv").config();
const express = require("express");
const webPush = require("web-push");

// Retrieve vapid keys from .env
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
};

// Set vapid keys
webPush.setVapidDetails(
  "mailto:test@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
