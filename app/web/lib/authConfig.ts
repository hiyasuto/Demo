import { Configuration, PopupRequest } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID || "",
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID || "common"}`,
    redirectUri: process.env.NEXT_PUBLIC_AZURE_AD_REDIRECT_URI || "http://localhost:3000",
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest: PopupRequest = {
  scopes: ["User.Read"],
};

export const apiRequest = {
  scopes: [`api://${process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID}/access_as_user`],
};
