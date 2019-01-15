FROM ubuntu:16.04
MAINTAINER pivotal

SHELL ["/bin/bash", "-c"]

# Install dependencies
RUN apt-get update && apt-get install -y autoconf bison build-essential curl git libfontconfig libpq-dev libssl-dev libyaml-dev libreadline6-dev zlib1g-dev libncurses5-dev libffi-dev libgdbm3 libgdbm-dev libnss3 libxi6 libgconf-2-4 unzip wget

# Install Rbenv and Ruby

RUN git clone https://github.com/rbenv/rbenv.git ~/.rbenv && echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc && echo 'eval "$(rbenv init -)"' >> ~/.bashrc
RUN git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
ENV PATH $PATH:/root/.rbenv/bin:/root/.rbenv/shims
RUN rbenv install 2.4.0 && rbenv global 2.4.0 && rbenv rehash
RUN echo 'gem: --no-rdoc --no-ri' >> /.gemrc
RUN gem install bundler

## Install Node
RUN curl -sL https://deb.nodesource.com/setup_11.x | bash
RUN apt-get update && apt-get install -y nodejs
RUN npm install -g bower
RUN npm install -g gulp

# Install Chrome WebDriver
RUN CHROMEDRIVER_VERSION='2.38' && \
    mkdir -p /opt/chromedriver-$CHROMEDRIVER_VERSION && \
    curl -sS -o /tmp/chromedriver_linux64.zip http://chromedriver.storage.googleapis.com/$CHROMEDRIVER_VERSION/chromedriver_linux64.zip && \
    unzip -qq /tmp/chromedriver_linux64.zip -d /opt/chromedriver-$CHROMEDRIVER_VERSION && \
    rm /tmp/chromedriver_linux64.zip && \
    chmod +x /opt/chromedriver-$CHROMEDRIVER_VERSION/chromedriver && \
    ln -fs /opt/chromedriver-$CHROMEDRIVER_VERSION/chromedriver /usr/local/bin/chromedriver

# Install Google Chrome
RUN curl -sS -o - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list
RUN apt-get -yqq update && apt-get -yqq install google-chrome-stable && rm -rf /var/lib/apt/lists/*

# Install Sqlite dev tools
RUN apt-get update && apt-get install libsqlite3-dev

# Install zip for packaging
RUN apt-get update && apt-get install zip
