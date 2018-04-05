# postfacto

[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/pivotalpostfacto/Lobby)

Postfacto is a **free**, **open-source** and **self-hosted** **retro tool** aimed at helping **remote teams**.

![](media/sample-retro.png)

Postfacto was originally created by [Pivotal Labs](https://pivotal.io/labs) by a team in their [Sydney office](https://pivotal.io/locations/sydney). It was originally available as a hosted SAAS product at [postfacto.io](https://postfacto.io) but has since been open sourced and focused on being a self hosted product. Postfacto is made up of a **React** web app and a **Ruby on Rails** API that provides an API for the front end.

You can stay up to date with the latest Postfacto releases by signing up to our [mailing list](http://eepurl.com/dlQPND).

## Features

### Run retros remotely

Postfacto let's you run an agile retrospective even when your team is distributed across the world.

### Record action items

Retros are designed to help the team improve and that's hard to do without keeping track of the actions the team needs to carry out and the also the one's you've achieved. Postfacto tracks the items you enter week to week to help you keep on top of them.

### Choose your level of security

You can create private retro boards for your team that are password protected or choose to leave them public so that anyone you give the link to can access it.

### Use your own video conferencing

Postfacto will auto generate you an [appear.in](https://appear.in) room for your team to chat in during the retro but you can also choose to link to your own conferencing tools.

### Easily deployable

You can deploy your own Postfacto to [Pivotal Web Services](#pivotal-web-services) or [Pivotal Cloud Foundry](#pivotal-cloud-foundry) and stay in control of your own data.

## Development

### Dependencies

* Ruby 2.4.0
* bundler
* rspec
* Postgres
* MySql
* Node 6
* npm 3.10.10 (`npm install -g npm@3.10.10`)
* gulp
* chromedriver

You can also use the Postfacto [docker image](https://hub.docker.com/r/postfacto/postfacto/) for development if you'd prefer. If you're not using Docker you'll need to install all the dependencies on your local machine and then run `bundle install` in `web` and `e2e` to install Ruby dependencies and then run `npm install` in `web` to install Javascript ones.

### Running locally

You can run Postfacto locally at [http://localhost:3000]() by running:

```bash
./run.sh
```

The admin dashboard will be available at [http://localhost:4000/admin](). You can create an admin user using the following rake task in the `api` directory:

```bash
ADMIN_EMAIL=email@example.com ADMIN_PASSWORD=password rake admin:create_user
```

### Running tests

You can run the tests for the whole project in the root directory by simply running:

```bash
./test.sh
```

#### Web

```bash
cd web
gulp spec-app
```

#### API

```bash
cd api
bundle exec rake
```

#### End to end

```bash
cd web
gulp local-acceptance
```

## Deployment

So you're ready to set Postfacto up, choose names for your web and API apps. We'll refer to these names as `api-app-name` and `web-app-name` from now on.
If you're deploying to [Pivotal Web Services](#pivotal-web-services), you can check they are available by making sure there is an error when visiting `your-chosen-name.cfapps.io`.

### Pivotal Web Services

[Pivotal Web Services](https://run.pivotal.io) provides a hosted version of Pivotal's [Cloud Foundry](https://pivotal.io/platform) platform and is probably the easiest place to get Postfacto up and running. You can use [Concourse](https://concourse.ci) to deploy and keep your instance up to date using the example pipeline in `deployments/pws` or if you'd prefer you can set it up manually using the steps below:

1. Sign up for a PWS account, install the CF CLI and set yourself up with an organization and space by following the instructions [here](https://docs.run.pivotal.io/starting/)
1. Once logged in to PWS, add a database and a Redis service instance to your space from the Marketplace. We recommend the free plans of ElephantSQL and Redis Cloud respectively for this. Name these services `postfacto-db` and `postfacto-redis`
1. Check out the Postfacto code
    ```bash
    git clone git@github.com:pivotal/postfacto.git
    ```

1. In `postfacto/deployment/pws/config/manifest-api.yml`, change the `{{api-app-name}}` and `{{web-app-name}}` to be your `api-app-name` and `web-app-name`
1. In `postfacto/deployment/pws/config/manifest-web.yml`, change the `{{web-app-name}}` to be your `web-app-name`
1. In `postfacto/deployment/pws/config/config.js`, change the `{{api-app-name}}` to be your `api-app-name`
1. In `postfacto/deployment/pws/deploy.sh`, change the `{{api-app-name}}` to be your `api-app-name`

1. Run the PWS deployment script from the `postfacto` directory:

  ```bash
  deployment/pws/deploy.sh
  ```

1. Log in to the admin dashboard (email: `email@example.com` and password: `password`) to check everything has worked at `api-app-name.cfapps.io/admin`
1. Create a retro for yourself by clicking on 'Retros' and the 'New Retro'
1. Log in to your retro at `web-app-name.cfapps.io/retros/you-retro-slug`
1. Share the URL and password with your team and then run a retro!

### Pivotal Cloud Foundry

You can use [Concourse](https://concourse.ci) to deploy and keep your instance up to date using the example pipeline in `deployments/pcf` or if you'd prefer you can set it up manually using the steps below:

1. Set yourself up with an organization and space in your PCF to deploy your Postfacto to.
1. Take note of your PCF url, going forward referred to as `pcf-url`
1. Add a database (Postgres or Mysql) and a Redis service instance to your space from the Marketplace. Name these services `postfacto-db` and `postfacto-redis`.
1. Check out the Postfacto code
    ```bash
    git clone git@github.com:pivotal/postfacto.git
    ```
1. In `postfacto/deployment/pcf/config/manifest-api.yml`, change the `{{api-app-name}}`, `{{web-app-name}}`, `{{pcf-url}}` to be your `api-app-name`, `web-app-name` and `pcf-url`
1. In `postfacto/deployment/pcf/config/manifest-web.yml`, change the `{{web-app-name}}` to be your `web-app-name`
1. In `postfacto/deployment/pcf/config/config.js`, change the `{{api-app-name}}`, `{{web-app-name}}`, and `{{pcf-url}}` to be your `api-app-name`, `web-app-name`, and `pcf-url`
1. In `postfacto/deployment/pcf/deploy.sh`, change the `{{api-app-name}}` to be your `api-app-name`

1. Run the PCF deployment script from the `postfacto` directory:

  ```bash
  deployment/pcf/deploy.sh
  ```

1. Log in to the admin dashboard (email: `email@example.com` and password: `password`) to check everything has worked at `api-app-name.{{pcf-url}}/admin`
1. Create a retro for yourself by clicking on 'Retros' and the 'New Retro'
1. Log in to your retro at `web-app-name.{{pcf-url}}/retros/you-retro-slug`
1. Share the URL and password with your team and then run a retro!

### Optional Setup

#### Setting up Google OAuth

In order for users to sign-up and create their own retros using the web UI, Postfacto needs Google OAuth setup.
For deployments that do not want to setup Google OAuth, you will need to create your retros through the admin console of your server via
`api-app-name.cfapps.io/admin` or `api-app-name.{{pcf-url}}/admin`.

1. Go to [Google Cloud Console](https://console.cloud.google.com) and
   create a new project
1. Go to APIs & Services > Credentials > Create Credentials > OAuth client ID > Web application
1. Choose a name for your app
1. In `Authorized JavaScript Origins`, set it to the public URL of your `web-app-name`.  For example: if deploying to PWS, your public URL will be `https://{{web-app-name}}.cfapps.io`
1. You can leave redirect blank
1. Take note of your `client-id` that is generated
1. In additional to the steps required for deploying to PWS, and PCF:
  1. For PWS, in `postfacto/deployment/pws/config/config.js`, add the
     line `"google_oauth_client_id": {{client-id}}` to the config object, and change
`{{client-id}}` to your generated Google OAuth `client-id`
  1. For PCF, in `postfacto/deployment/pcf/config/config.js`, add the
     line `"google_oauth_client_id": {{client-id}}` to the config object, and change
`{{client-id}}` to your generated Google OAuth `client-id`

## Contributing

See our [Contributing Guide](CONTRIBUTING.md).

## License

Postfacto is licensed under the **GNU Affero General Public License** (often referred to as **AGPL-3.0**). The full text of the license is available [here](LICENSE.md). It's important to note that this license allows you to deploy an instance of Postfacto for private, public or internal use.
