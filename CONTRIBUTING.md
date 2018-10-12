# Development Environment

## Dependencies

* Ruby 2.4.0
* bundler
* rspec
* Node 6
* npm 3.10.10 (`npm install -g npm@3.10.10`)
* gulp
* chromedriver

To avoid having to install and manage these dependencies you can use the Postfacto [docker image](https://hub.docker.com/r/postfacto/postfacto/) for development.

## Installing library dependencies

Before development you'll need to install library dependencies (gems and npm packages) for the `web`, `api` and `e2e` codebases by running:

```bash
./deps.sh
```

## Running locally

You can run Postfacto locally at [http://localhost:3000]() by running:

```bash
./run.sh
```

The admin dashboard will be available at [http://localhost:4000/admin](). You can create an admin user using the following rake task in the `api` directory:

```bash
ADMIN_EMAIL=email@example.com ADMIN_PASSWORD=password rake admin:create_user
```

## Running tests

You can run the tests for the whole project in the root directory by simply running:

```bash
./test.sh
```

### Web

```bash
cd web
gulp spec-app
```

### API

```bash
cd api
bundle exec rake
```

### End to end

```bash
cd web
gulp local-acceptance
```

# Contributing to Pivotal Projects

We’d love to accept your patches and contributions to this project. Please review the following guidelines you'll need to follow in order to make a contribution.

## Contributor License Agreement

All contributors to this project must have a signed Contributor License Agreement (**"CLA"**) on file with us. The CLA grants us the permissions we need to use and redistribute your contributions as part of the project; you or your employer retain the copyright to your contribution. Head over to https://cla.pivotal.io/ to see your current agreement(s) on file or to sign a new one.

We generally only need you (or your employer) to sign our CLA once and once signed, you should be able to submit contributions to any Pivotal project.

Note: if you would like to submit an "_obvious fix_" for something like a typo, formatting issue or spelling mistake, you may not need to sign the CLA. Please see our information on [obvious fixes](https://cla.pivotal.io/about#obvious-fix) for more details.

## Working on features

If you're interested on working on a feature for us we have a [Backlog](https://github.com/pivotal/postfacto/projects/1) of work for people to pick up at anytime. Have a look at both the Backlog' and 'Icebox' sections and if something catches your eye leave a comment and we can chat about assigning it to you. If the feature you had in mind isn't already there then [get in touch](https://gitter.im/pivotalpostfacto/Lobby)! We're always eager to hear about new ideas for Postfacto.

## Code reviews

All submissions, including submissions by project members, require review and we use GitHub's pull requests for this purpose. Please consult [GitHub Help](https://help.github.com/articles/about-pull-requests/) if you need more information about using pull requests.

## Giving yourself credit

We maintain a [humans.txt](humans.txt) file so that we can keep a list of all the people that have contributed throughout the development of Postfacto. If you'd like to add yourself feel free to do so as part of a Pull Request by putting your name and contact info (if you'd like) in the 'CONTRIBUTORS' section.
