# Deployment

1. Download and extract the latest `package.zip` from the [releases page](https://github.com/pivotal/postfacto/releases)
1. Choose a name for your app, we'll refer to this as `app-name` from now on
1. _[Strongly recommended]_ Choose an admin email and password to override the defaults (`email@example.com` and `password` respectively), we'll refer to these as `admin-email` and `admin-password` from now on
1. _[Optional]_ Configure your deployment:
      * [Add Google Auth](#allowing-users-to-create-retros)
      * [Enable analytics](#enabling-analytics)
      * [Increase the session timeout](#changing-session-timeout)
      * [Use TLS for database connections](#using-tls-for-database-connections)
      * [Deploy without Redis (only for v4.3.0 or higher with Postgres)](#removing-redis-dependency)
1. Follow the instructions to deploy for your platform:
      * [Tanzu Application Service](#tanzu-application-service)
      * [Tanzu Kubernetes Grid (vSphere)](#tanzu-kubernetes-grid-vsphere)
      * [Cloud Foundry](#cloud-foundry)
      * [Heroku](#heroku)
1. [Test your deployment](#testing-your-deployment)

## Configuration

### Allowing users to create retros

In order for users to sign-up and create their own retros using the web UI, Postfacto needs Google OAuth setup.
For deployments that do not want to setup Google OAuth, you will need to create your retros through the admin console of your server via
`<app-name>.<cf-url>/admin`

1. Go to [Google Cloud Console](https://console.cloud.google.com) and
   create a new project
1. Go to APIs & Services > Credentials > Create Credentials > OAuth client ID > Web application
1. Choose a name for your app
1. In `Authorized JavaScript Origins`, set it to the public URL of your `app-name`. For example: if deploying to Heroku, your public URL will be `https://<app-name>.herokuapp.com`
1. You can leave redirect blank
1. Take note of your `client-id` that is generated
1. Add `"google_oauth_client_id": {{client-id}}` to the `config.js` for your installation

### Enabling analytics

If you'd like to have your instance send analytics data to the Postfacto team so they can learn about how you're using it and continue to improve it you can! To switch this on add `"enable_analytics": true` to the `config.js` object for your installation. Please note that we do not record any personal data (such as emails or retro data). As we are recording events from you we will however see the URL of the web client for your instance. If you're not comfortable with this don't worry, this feature is disabled by default.

### Changing session timeout

You can customise this window with the `SESSION_TIME` env variable to the `env` on deploy. To set a session time of 1 hour for example:

```bash
SESSION_TIME=60 ./deploy.sh <app-name>
```

### Using TLS for database connections

If your database only accepts incoming TLS encrypted connections, you will need to modify the application settings to include the appropriate SSL parameters. Please add the below configuration snippet to `package/assets/config/database.yml` prior to executing `deploy.sh`.

#### For MySQL

```yaml
production:
  sslmode: preferred # or verify_identiy, verify_ca
  sslca: /etc/ssl/certs/ca-certificates.crt # or alternate location where your ca file is located
```

When this is not set, you will receive this error:

```
Connections using insecure transport are prohibited while --require_secure_transport=ON.
```

More information about MySQL SSL modes can be found [here](https://dev.mysql.com/doc/refman/8.0/en/using-encrypted-connections.html).

#### For PostgreSQL

```yaml
production:
  sslmode: prefer # or verify-full, verify-ca, require
  sslca: /etc/ssl/certs/ca-certificates.crt # or alternate location where your ca file is located
```

More information about SSL modes can be found [here](https://www.postgresql.org/docs/9.1/libpq-ssl.html).

### Removing Redis dependency
If you are on a **later version than 4.3.0** and using Postgres, Redis is no longer required. Instead set the environment variable `USE_POSTGRES_FOR_ACTION_CABLE=true` on deploy.

However, note that for larger retros the live websocket updates may stop working (see [#346](https://github.com/pivotal/postfacto/issues/346)) as the Postgres adapter has an 8kB payload limit.

## Tanzu Application Service

#### Initial deployment

1. Set yourself up with an organization and space in your TAS account to deploy Postfacto to
1. Add a database (Postgres or MySQL) and a Redis service instance to your space from the Marketplace. Name these services `postfacto-db` and `postfacto-redis`
1. Run the TAS deployment script from the `tas` directory, either:

    ```bash
    ADMIN_EMAIL=<admin-email> ADMIN_PASSWORD=<admin-password> ./deploy.sh <app-name>
    ```

    or, to use the default admin credentials (`email@example.com` and `password`):

    ```bash
    ./deploy.sh <app-name>
    ```

   Take note of the URL that has shown up in the `routes:` section of the script output, going forward referred to as `<app-url>`
1. Log in to the Postfacto admin dashboard (email: `email@example.com` and password: `password`) to check everything has worked at `<app-url>/admin`
1. Create a retro for yourself by clicking on 'Retros' and the 'New Retro'
1. Log in to your retro at `<app-url>/retros/your-retro-slug`
1. Share the URL and password with your team and then run a retro!

#### Upgrading a deployment

1. Presuming the steps in the Initial deployment section have been completed, run the upgrade script from the `tas` directory:
    ```bash
    ./upgrade.sh <app-name>
    ```

## Tanzu Kubernetes Grid (vSphere)

### Prerequisites

1. A vSphere instance version 6.7u3 or higher, with Tanzu Kubernetes Grid (TKG) provisioned

1. A network load balancer installed and configured on your TKG cluster (e.g. [MetalLB](https://metallb.universe.tf/installation/))

1. A default storage class available in your TKG cluster (e.g. [vSphereStorageClass](tkg/examples/storageclass.yaml))

### Initial deployment

1. Install [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) to your local machine
1. Install [helm](https://helm.sh/docs/intro/install/) to your local machine
1. Make sure `kubectl` is configured to connect to the TKG cluster (ask your administrator for the configuration)
1. Run the deployment script from the `tkg` directory, either:

    ```bash
    ADMIN_EMAIL=<admin-email> ADMIN_PASSWORD=<admin-password> ./deploy.sh <app-name>
    ```

    or, to use the default admin credentials (`email@example.com` and `password`):

    ```bash
    ./deploy.sh <app-name>
    ```

1. Keep note of the application url output by the deployment script, going forward referred to as `tkg-url` 
1. Log in to the admin dashboard at `<tkg-url>/admin` (email: `email@example.com` and password: `password`)
1. Create a retro for yourself by clicking on 'Retros' and then 'New Retro'
1. Log in to your retro at `<tkg-url>/retros/your-retro-slug`
1. Share the URL and password with your team and then run a retro!

### Upgrading a deployment

1. Presuming the steps in the Initial deployment section have been completed, run the upgrade script from the `tkg` directory:
    ```bash
    ./upgrade.sh <app-name>
    ```

## Cloud Foundry

#### Initial deployment

1. Set yourself up with an organization and space in your CF to deploy your Postfacto to
1. Take note of your CF url, going forward referred to as `cf-url`
1. Add a database (Postgres or Mysql) and a Redis service instance to your space from the Marketplace; name these services `postfacto-db` and `postfacto-redis`
1. Run the CF deployment script from the `cf` directory, either:

    ```bash
    ADMIN_EMAIL=<admin-email> ADMIN_PASSWORD=<admin-password> ./deploy.sh <app-name>
    ```

    or, to use the default admin credentials (`email@example.com` and `password`):

    ```bash
    ./deploy.sh <app-name>
    ```

1. Log in to the Postfacto admin dashboard to check everything has worked at `<app-name>.<cf-url>/admin`
1. Create a retro for yourself by clicking on 'Retros' and then 'New Retro'
1. Log in to your retro at `<app-name>.<cf-url>/retros/your-retro-slug`
1. Share the URL and password with your team and then run a retro!

#### Upgrading a deployment

1. Presuming the steps in the Initial deployment section have been completed, run the upgrade script from the `cf` directory:
    ```bash
    ./upgrade.sh <app-name>
    ```

#### Migrating a deployment

1. If you'd previously deployed a version of Postfacto prior to 4.0, run the migration script from the `cf` directory:
    ```bash
    ./migrate.sh <web-app-name> <api-app-name>
    ```
    **Note** that the admin panel will move from `<api-app-name>.<cf-url>/admin` to `<web-app-name>.<cf-url>/admin` and the API app will be deleted

## Heroku

#### Initial deployment

1. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
1. Run the Heroku deployment script from the `heroku` directory, either:

    ```bash
    ADMIN_EMAIL=<admin-email> ADMIN_PASSWORD=<admin-password> ./deploy.sh <app-name>
    ```

    or, to use the default admin credentials (`email@example.com` and `password`):

    ```bash
    ./deploy.sh <app-name>
    ```

    If you want to deploy to the EU [region](https://devcenter.heroku.com/articles/regions), rather than the default US region, prefix the deploy command with `HEROKU_REGION=eu`

1. Log in to the Postfacto admin dashboard to check everything has worked at `<app-name>.herokuapp.com/admin`
1. Create a retro for yourself by clicking on 'Retros' and then 'New Retro'
1. Log in to your retro at `<app-name>.herokuapp.com/retros/your-retro-slug`
1. Share the URL and password with your team and then run a retro!

#### Upgrading a deployment

1. Presuming the steps in the Initial deployment section have been completed, run the upgrade script from the `heroku` directory:
    ```bash
    ./upgrade.sh <app-name>
    ```

#### Migrating a deployment

 > ⚠️ **Warning**: the Heroku migration will attempt to migrate your data to a new database instance and delete the old one. Take a look at what the script is doing and make sure you understand the implications before running it.

1. If you'd previously deployed a version of Postfacto prior to 4.0, run the migration script from the `heroku` directory:
    ```bash
    ./migrate.sh <web-app-name> <api-app-name>
    ```
    **Note** that the admin panel will move from `<api-app-name>.herokuapp.com/admin` to `<web-app-name>.herokuapp.com/admin` and the API app will be deleted

## Testing your deployment

1. Log in to the Postfacto admin dashboard
1. Create a new admin user for the test to use by clicking on 'Admin Users' and then 'New Admin User'. Take note of the email and password you use, as these will be used in the next step
1. Run the smoke test script from the root of the package directory:
    ```bash
    ./smoke-test.sh <app-url> <app-admin-url> <test-admin-email> <test-admin-password>
    ```
