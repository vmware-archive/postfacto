# Upgrades

To update the version of Ruby used in Postfacto, the following steps need to be taken:

 1. Update the `.tool-versions` file for anyone using [asdf-vm][1]

 2. In `api/`, update `.ruby-version` and `Gemfile`, then run `bundle install` to update `Gemfile.lock`

 3. In `e2e/`, update `.ruby-version` and `Gemfile`, then run `bundle install` to update `Gemfile.lock`

 4. In `docker/dev/Dockerfile`, update the line `ENV RUBY_VERSION <version>`

 5. In `docker.sh`, update the command with `postfacto/dev:<version>`

 6. From the root directory, run the following command to build and tag the new image:

    ```bash
    docker build . -f ./docker/dev/Dockerfile -t postfacto/dev:<version>
    ```

 7. Test the new image and all of the updates by running `docker.sh` then running the tests inside the container with
    `cd postfacto && ./test.sh`

 8. Publish the new `postfacto:dev` image to Docker Hub

 9. Update the pinned buildpacks in `deployment/{cf,tas}/config/manifest.yml`, according to the latest
    [release][2] that supports the selected version

 10. Update the pinned buildpacks in `deployment/{deploy,upgrade}-heroku.sh`, according to the latest [release][3] that
    supports the selected version

 11. You can now commit and push and make sure everything passes in CI

  [1]: https://asdf-vm.com/#/
  [2]: https://github.com/cloudfoundry/ruby-buildpack/releases
  [3]: https://github.com/heroku/heroku-buildpack-ruby/blob/master/CHANGELOG.md
