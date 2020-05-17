const env = process.env.NODE_ENV;

export const appConfig = {
         api: {
           networkInterface: {
             development: "http://localhost:3000/api",
             staging: "http://localhost:3001/api",
             production: "http://localhost:3003/api",
           }[env],
           // add more here
         },
       };

export default appConfig;
