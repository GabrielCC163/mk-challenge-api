# Mk Solutions - Backend Challenge - API with Node.js

### Local Requirements

- Docker and Docker Compose

## **Local Initialization**

### Run the commands below only on first startup

<i>This will create the database tables and insert the default user</i>

```
docker-compose up -d db

docker-compose run --rm api npx sequelize db:migrate

docker-compose run --rm api npx sequelize db:seed:all
```

### Start the API

```
docker-compose up
```

## **Running requests with Insomnia**

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=mk-api-requests&uri=https%3A%2F%2Fgist.githubusercontent.com%2FGabrielCC163%2Faa704cde3dcc04adf7214afd26919ce1%2Fraw%2F697ccd3d1b81600e1f6154d2c304cc480b331278%2Fmk-api-requests.json)

## **Run tests**

```
docker-compose run -e NODE_ENV=test --rm --no-deps api yarn test
```
