export enum NodeEnvironments {
  PROD = "prod",
  DEVELOPMENT = "development",
  LOCAL = "local",
}

namespace ServerConfig {
  // * Database Connection
  const ENV: string = process.env.ENV ? process.env.ENV : "local";
  const DB_NAME = "task-list-app";

  // * Check is production
  export function isProduction(): Readonly<boolean> {
    return ENV === "prod";
  }

  export function isDevelopment(): Readonly<boolean> {
    return ENV === "development";
  }

  // * Check is local
  export function isLocal(): Readonly<boolean> {
    return ENV === "local";
  }

  export function getBackendBaseUrl(): Readonly<string> {
    if (isProduction()) {
      return "https://task-list-app-20092021.herokuapp.com";
    } else if (isDevelopment()) {
      return "https://task-list-app-20092021.herokuapp.com";
    }
    return "http://localhost:3500";
  }
}

export default ServerConfig;
