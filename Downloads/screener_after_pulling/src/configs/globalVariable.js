export const ENV_PROXY=import.meta.env.VITE_PROXY_PROTOCOL + import.meta.env.VITE_PROXY_URL || "";
export const ENV_CHAT_PROXY=import.meta.env.VITE_PROXY_URL || "";
export const BACKEND_URL=ENV_PROXY
export const BACKEND_CHAT_URL=ENV_CHAT_PROXY
export const MIXPANEL_PROJECT_TOKEN = import.meta.env.VITE_MIXPANEL_PROJECT_TOKEN;
