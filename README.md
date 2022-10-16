# Login System (login-system)

This is a user authentication template created using Quasar, vue3 and nodejs. It features user registration, login, logout routes alongside functions and additional routes to handle JWT token authorization. Requires all dependencies as well as a filled out .env file.

## Env format:
```
ENV = "DEV" 
# or prod above, I use it to differentiate environments for annoying CORs issues on local dev
PORT = 3000
# whatever you want
ACCESS_TOKEN_SECRET = yourtokenhere
REFRESH_TOKEN_SECRET = yourtokenhere
```

## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Lint the files
```bash
yarn lint
# or
npm run lint
```


### Format the files
```bash
yarn format
# or
npm run format
```



### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js).
