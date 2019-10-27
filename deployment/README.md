# Deployment

**Note: If you have not already done so, download and extract the latest package from the [releases page](https://github.com/pivotal/postfacto/releases)**

So you're ready to set Postfacto up, choose a name for your app. We'll refer to this as `app-name` from now on.

## Pivotal Web Services

### Initial deployment

[Pivotal Web Services](https://run.pivotal.io) provides a hosted version of Pivotal's [Cloud Foundry](https://pivotal.io/platform) platform and is probably the easiest place to get Postfacto up and running.

1. Sign up for a PWS account, install the CF CLI and set yourself up with an organization and space by following the instructions [here](https://docs.run.pivotal.io/starting/)
1. Once logged in to PWS, add a database and a Redis service instance to your space from the Marketplace. We recommend the free plans of ElephantSQL and Redis Cloud respectively for this. Name these services `postfacto-db` and `postfacto-redis`
1. Run the PWS deployment script from the `pws` directory:

    ```bash
    ./deploy.sh <app-name>
    ```
1. Log in to the admin dashboard (email: `email@example.com` and password: `password`) to check everything has worked at `<app-name>.cfapps.io/admin`
1. Create a retro for yourself by clicking on 'Retros' and the 'New Retro'
1. Log in to your retro at `<app-name>.cfapps.io/retros/your-retro-slug`
1. Share the URL and password with your team and then run a retro!

### Upgrading a deployment

1. Presuming the steps in the Initial deployment section have been completed, run the upgrade script from the `pws` directory:
    ```bash
    ./upgrade.sh <app-name>
    ```

### Migrating a deployment

1. If you'd previously deployed a version of Postfacto prior to 4.0, run the migration script from the `pws` directory:
    ```bash
    ./migrate.sh <web-app-name> <api-app-name>
    ```
    **Note** that the admin panel will move from `<api-app-name>.cfapps.io/admin` to `<web-app-name>.cfapps.io/admin` and the API app will be deleted

## Pivotal Cloud Foundry

### Initial deployment

1. Set yourself up with an organization and space in your PCF to deploy your Postfacto to.
1. Take note of your PCF url, going forward referred to as `pcf-url`
1. Add a database (Postgres or Mysql) and a Redis service instance to your space from the Marketplace. Name these services `postfacto-db` and `postfacto-redis`.
1. Run the PCF deployment script from the `pcf` directory:

    ```bash
    ./deploy.sh <app-name>
    ```
1. Log in to the admin dashboard (email: `email@example.com` and password: `password`) to check everything has worked at `<app-name>.<pcf-url>/admin`
1. Create a retro for yourself by clicking on 'Retros' and the 'New Retro'
1. Log in to your retro at `<app-name>.<pcf-url>/retros/your-retro-slug`
1. Share the URL and password with your team and then run a retro!

### Upgrading a deployment

1. Presuming the steps in the Initial deployment section have been completed, run the upgrade script from the `pcf` directory:
    ```bash
    ./upgrade.sh <app-name>
    ```

### Migrating a deployment

1. If you'd previously deployed a version of Postfacto prior to 4.0, run the migration script from the `pcf` directory:
    ```bash
    ./migrate.sh <web-app-name> <api-app-name>
    ```
    **Note** that the admin panel will move from `<api-app-name>.<pcf-url>/admin` to `<web-app-name>.<pcf-url>/admin` and the API app will be deleted

## Heroku

### Initial deployment

1. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
1. Run the Heroku deployment script from the `heroku` directory:

    ```bash
    ./deploy.sh <app-name>
    ```
1. Log in to the admin dashboard (email: `email@example.com` and password: `password`) to check everything has worked at `<app-name>.herokuapp.com/admin`
1. Create a retro for yourself by clicking on 'Retros' and the 'New Retro'
1. Log in to your retro at `<app-name>.herokuapp.com/retros/your-retro-slug`
1. Share the URL and password with your team and then run a retro!

### Upgrading a deployment

1. Presuming the steps in the Initial deployment section have been completed, run the upgrade script from the `heroku` directory:
    ```bash
    ./upgrade.sh <app-name>
    ```

### Migrating a deployment

 > ⚠️ **Warning**: the Heroku migration will attempt to migrate your data to a new database instance and delete the old one. Take a look at what the script is doing and make sure you understand the implications before running it.

1. If you'd previously deployed a version of Postfacto prior to 4.0, run the migration script from the `heroku` directory:
    ```bash
    ./migrate.sh <web-app-name> <api-app-name>
    ```
    **Note** that the admin panel will move from `<api-app-name>.herokuapp.com/admin` to `<web-app-name>.herokuapp.com/admin` and the API app will be deleted

## Configuration

### Allowing users to create retros

In order for users to sign-up and create their own retros using the web UI, Postfacto needs Google OAuth setup.
For deployments that do not want to setup Google OAuth, you will need to create your retros through the admin console of your server via
`<app-name>.cfapps.io/admin` or `<app-name>.<pcf-url>/admin`.

1. Go to [Google Cloud Console](https://console.cloud.google.com) and
   create a new project
1. Go to APIs & Services > Credentials > Create Credentials > OAuth client ID > Web application
1. Choose a name for your app
1. In `Authorized JavaScript Origins`, set it to the public URL of your `app-name`. For example: if deploying to PWS, your public URL will be `https://<app-name>.<pcf-url>`
1. You can leave redirect blank
1. Take note of your `client-id` that is generated
1. Add `"google_oauth_client_id": {{client-id}}` to the `config.js` for your installation.

### Enabling analytics

If you'd like to have your instance send analytics data to the Postfacto team so they can learn about how you're using it and continue to improve it you can! To switch this on add `"enable_analytics": true` to the `config.js` object for your installation. Please note that we do not record any personal data (such as emails or retro data). As we are recording events from you we will however see the URL of the web client for your instance. If you're not comfortable with this don't worry, this feature is disabled by default.

### Changing session timeout

You can customise this window with the `SESSION_TIME` env variable to the `env` on deploy. To set a session time of 1 hour for example:

```bash
SESSION_TIME=60 ./deploy <app-name>
```
