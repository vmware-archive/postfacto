FROM ubuntu:16.04
MAINTAINER pivotal

SHELL ["/bin/bash", "-c"]

# Install dependencies
RUN apt-get update && apt-get install -y autoconf bison build-essential curl git libfontconfig libpq-dev libssl-dev libyaml-dev libreadline6-dev zlib1g-dev libncurses5-dev libffi-dev libgdbm3 libgdbm-dev libnss3 libxi6 libgconf-2-4 unzip wget

# Install Rbenv and Ruby

RUN git clone https://github.com/rbenv/rbenv.git ~/.rbenv && echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc && echo 'eval "$(rbenv init -)"' >> ~/.bashrc
RUN git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
ENV PATH $PATH:/root/.rbenv/bin:/root/.rbenv/shims
RUN cd /root/.rbenv/plugins/ruby-build && git pull && cd -
RUN rbenv install 2.6.1 && rbenv global 2.6.1 && rbenv rehash
RUN echo 'gem: --no-rdoc --no-ri' >> /.gemrc
RUN gem install bundler

# Install Node
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 11.10.1
RUN curl --silent -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.2/install.sh | bash
RUN source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default
ENV NODE_PATH $NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Install Python for Node SASS
RUN apt-get update && apt-get install -y python


# Install Chrome WebDriver
RUN apt-get update && apt-get install -y apt-transport-https ca-certificates
RUN CHROMEDRIVER_VERSION='2.45' && \
    mkdir -p /opt/chromedriver-$CHROMEDRIVER_VERSION && \
    curl -sS -o /tmp/chromedriver_linux64.zip https://chromedriver.storage.googleapis.com/$CHROMEDRIVER_VERSION/chromedriver_linux64.zip && \
    unzip -qq /tmp/chromedriver_linux64.zip -d /opt/chromedriver-$CHROMEDRIVER_VERSION && \
    rm /tmp/chromedriver_linux64.zip && \
    chmod +x /opt/chromedriver-$CHROMEDRIVER_VERSION/chromedriver && \
    ln -fs /opt/chromedriver-$CHROMEDRIVER_VERSION/chromedriver /usr/local/bin/chromedriver

# Install Google Chrome
RUN curl -sS -o - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb https://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list
RUN apt-get -yqq update && apt-get -yqq install google-chrome-stable && rm -rf /var/lib/apt/lists/*

# Install Sqlite dev tools
RUN apt-get update && apt-get install -y libsqlite3-dev

# Install zip for packaging
RUN apt-get update && apt-get install -y zip

# Install tmux for run/test scripts
RUN apt-get update && apt-get install -y tmux

# Cache dependencies
RUN git clone https://github.com/pivotal/postfacto.git
RUN cd /postfacto && ./deps.sh && cd .. && rm -rf /postfacto
