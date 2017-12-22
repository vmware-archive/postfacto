# postfacto

Postfacto is a **free**, **open-source** and **self-hosted** **retro tool** aimed at helping **remote teams**.

![](media/sample-retro.png)

Postfacto was originally created by [Pivotal Labs](https://pivotal.io/labs) by a team in their [Sydney office](https://pivotal.io/locations/sydney). It was originally available as a hosted SAAS product at [postfacto.io](https://postfacto.io) but has since been open sourced and focused on being a self hosted product. Postfacto is made up of a **React** web app and a **Ruby on Rails** API that provides an API for the front end.

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

You can deploy your own Postfacto to [Pivotal Web Services](https://run.pivotal.io) and stay in control of your own data.

## Development

### Dependencies

* Ruby 2.4.0
* bundler
* rspec
* Postgres
* Node 6
* npm 3.10.10 (`npm install -g npm@3.10.10`)
* gulp
* chromedriver

### Running locally

You can run Postfacto locally at [https://localhost:3000]() by running the following in the `web` directory:

```bash
gulp local-run
```

The admin dashboard will be available at [https://localhost:400/admin]().

### Running tests

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

### Pivotal Web Services

Pivotal Web Services provides a hosted version of Pivotal's Cloud Foundry platform and is probably the easiest place to get Postfacto up and running. To set it up just carry out the following steps:

1. Sign up for a PWS account, install the CF CLI and set yourself up with an organization and space by following the instructions [here](https://docs.run.pivotal.io/starting/)
1. Once logged in to PWS, add a database and a Redis service instance to your space from the Marketplace. We recommend the free plans of ElephantSQL and Redis Cloud respectively for this. Name these services `postfacto-db` and `postfacto-redis`
1. Check out the Postfacto code
    ```bash
    > git clone git@github.com:pivotal/postfacto.git
    ```
    
1. Choose names for your web and API apps. You can check they are available by making sure there is an error when visiting `your-chosen-name.cfapps.io`. We'll refer to these names as `api-app-name` and `web-app-name` from now on.
1. In the `postfacto` directory change the `{{api-app-name }}` and `{{web-app-name}}` in `deployment/pws/config/manifest-api.yml` to be your `api-app-name` and `web-app-name`
1. Deploy the API from the `postfacto` directory:
    ```bash
    > cf push -f deployment/pws/config/manifest.yml -p api
    ```

1. Create an admin user (for creating and managing retros):
    ```bash
    > cf run-task api-app-name 'ADMIN_EMAIL=email@example.com ADMIN_PASSWORD=password rake admin:create_user'
    ```

1. Log in to the admin dashboard using your chosen email and password to check everything has worked at `api-app-name.cfapps.io`
1. Create a retro for yourself by clicking on 'Retros' and the 'New Retro'
1. In the `postfacto` directory change the `{{web-app-name }}` and `{{api-app-name}}` in `deployment/pws/config/manifest-web.yml` and `deployment/pws/config/manifest-web.yml` to be your `api-app-name` and `web-app-name`
1. Build the web app in `postfacto/web`:
    ```bash
    > NODE_ENV=production gulp assets
    > gulp package
    > cp ../deployment/pws/config/config.js .
    ```

1. Deploy the web app from the `postfacto` directory:
    ```bash
    > cf push -f deployments/pws/manifest-web.yml -p web
    ```

1. Log in to your retro at `web-app-name.cfapps.io/retros/you-retro-slug`
1. Share the URL and password with your team and then run a retro!

### Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

### License

Postfacto is licensed under the **GNU Affero General Public License** (often referred to as **AGPL-3.0**). The full text of the license is available [here](LICENSE.md). It's important to note that this license allows you too deploy an instance of Postfacto for private or internal use.
