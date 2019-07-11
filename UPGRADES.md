# Upgrades

To update the version of Ruby used in Postfacto, the following steps need to be taken:

 1. Update the `.tool-versions` file for anyone using [asdf-vm]

 2. In `api/`, update `.ruby-version` and `Gemfile`, then run `bundle install` to update `Gemfile.lock`

 3. In `e2e/`, update `.ruby-version` and `Gemfile`, then run `bundle install` to update `Gemfile.lock`

 4. In `docker/dev/Dockerfile`, update the line `ENV RUBY_VERSION <version>`

 5. In `docker.sh`, update the command with `postfacto/dev:<version>`

 6. In `.travis.yml`, update the script with `postfacto/dev:<version>`

 7. From the root directory, run the following command to build and tag the new image:

    ```bash
    docker build . -f ./docker/dev/Dockerfile -t postfacto/dev:<version>
    ```

 8. Test the new image and all of the updates by running `docker.sh` then running the tests inside the container with
    `cd postfacto && ./test.sh`

 9. Publish the new image to Docker Hub - this needs to happen *before* the Travis build can complete

 10. Update the pinned buildpacks in `deployment/{pcf,pws}/config/manifest-api.yml`, according to the latest [release]
    that supports the selected version

 11. You can now commit and push and make sure everything passes in Travis

  [asdf-vm]: https://asdf-vm.com/#/
  [release]: https://github.com/cloudfoundry/ruby-buildpack/releases
