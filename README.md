## Firebase

Run all firebase emulators:

```sh
firebase emulators:start
```

Run functions emulator only:

```sh
firebase emulators:start --only functions
```

Add secret:

```sh
firebase functions:secrets:set SECRET_NAME
```

```
export GOOGLE_APPLICATION_CREDENTIALS="\workspaces\social-unlock\secrets\app-engine-service-account-key.json"
```

## Stripe

```sh
stripe listen --forward-to localhost:4242/webhook
```

Test credit card number:

```
4242 4242 4242 4242
```

## Ngrok

```
ngrok http 3000
```

## Using Docker

1. [Install Docker](https://docs.docker.com/get-docker/) on your machine.
1. Build your container: `docker build -t nextjs-docker .`.
1. Run your container: `docker run -p 3000:3000 nextjs-docker`.

You can view your images created with `docker images`.

## Running Locally

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.
