# Postfacto
[![Build Status](https://github.com/pivotal/postfacto/actions/workflows/push.yml/badge.svg)](https://github.com/pivotal/postfacto/actions/workflows/push.yml)

Postfacto helps teams run great [retrospectives](https://content.pivotal.io/blog/how-to-run-a-really-good-retrospective) remotely.

<p align="center">
  <img width="700px" src="https://github.com/pivotal/postfacto/blob/master/media/sample-retro.gif?raw=true" />
</p>


## Features

### Run Retros Remotely
Postfacto lets you run an agile retrospective even when your team is distributed across the world. Your retros will live update across all your devices so each participant can follow along on their device.

### Easy Onboarding
Easily [set up](deployment/README.md#allowing-users-to-create-retros) Postfacto to work with Google OAuth so users can sign up with their Google accounts. Alternatively, you can control access to your instance with the admin dashboard.

### Run Public or Private Retros
You can create private retro boards for your team that are password protected or choose to leave them public so that anyone you give the link to can access them.

### Mobile Friendly
Participants can add and vote on items from their mobile devices, so it is easy to run a retro without everyone in the group having a laptop nearby. This works well for retros where some people are in the room and some are remote.

### Record Action Items
Retros are designed to help teams improve and that's hard to do without taking action. Postfacto tracks your team's actions to help you keep on top of them.


## Deployment

Postfacto is a self hosted product, this makes it easier for you to stay in control of your data.

We aim to make it easy to deploy to as many locations as possible, and currently support the following platforms:

* Tanzu Kubernetes Grid
* Tanzu Application Service
* Cloud Foundry
* Heroku

Deployment instructions can be found [here](deployment/README.md).

If the platforms above don't work for you; you may be able to find a way to run Postfacto yourself by following the Contributing Guide.

## Contributing

See the [Contributing Guide](CONTRIBUTING.md) for more info.

## License

Postfacto is licensed under the **GNU Affero General Public License** (often referred to as **AGPL-3.0**). The full text 
of the license is available [here](LICENSE.md). It's important to note that this license allows you to deploy an instance of Postfacto for private, public or internal use.
