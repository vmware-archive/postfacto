FROM node:12.6.0 as front-end

COPY ./web /web
WORKDIR /web

RUN npm install
RUN npm run build

FROM ruby:2.6.3
RUN gem install bundler:2.0.1

COPY ./api /postfacto
COPY --from=front-end /web/build /postfacto/public/

WORKDIR /postfacto

RUN bundle install --without test
RUN apt-get update -qq
RUN apt-get install -y nodejs
RUN bundle exec rake assets:precompile

ENV RAILS_ENV production
ENV RAILS_SERVE_STATIC_FILES true

EXPOSE 4000

CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0", "-p", "4000"]






