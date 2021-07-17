# wealth-for-ynab

### Initial deploy (per environment)

```sh
$ ./misc/create-registries <ENV NAME>
$ sam build
$ sam deploy --guided
```

### Development

#### Web

Run `npm run serve` in the `/web` directory.

#### Api

Run `sam build` in the root directory and then `sam local start-api`.

### Deployment to Dev Environment

#### Web

Run `./deploy web` in the root directory

#### Api (and the rest of the SAM template)

Run `./deploy api` in the root directory

#### Both

Run `./deploy` in the root directory

### AWS SSM

These parameters must be created in AWS SSM Parameter Store

| Parameter                 | Value                                          |
| ------------------------- | ---------------------------------------------- |
| `/YNAB/ClientId`          | 1Password                                      |
| `/YNAB/ClientSecret`      | 1Password                                      |
| `/Questrade/ApiUrl`       | `https://api01.iq.questrade.com`               |
| `/Questrade/AuthUrl`      | `https://login.questrade.com/oauth2/authorize` |
| `/Questrade/ClientId`     | 1Password                                      |
| `/Questrade/ClientSecret` | 1Password                                      |
