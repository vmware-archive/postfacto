FROM ubuntu:20.04
MAINTAINER pivotal

SHELL ["/bin/bash", "-c"]

# Install dependencies
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y autoconf bison build-essential curl git libfontconfig libpq-dev libssl-dev libyaml-dev libreadline6-dev zlib1g-dev libncurses5-dev libffi-dev libgdbm-dev libnss3 libxi6 libgconf-2-4 unzip wget

# Install Rbenv and Ruby
RUN git clone https://github.com/rbenv/rbenv.git ~/.rbenv && echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc && echo 'eval "$(rbenv init -)"' >> ~/.bashrc
RUN git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
ENV PATH $PATH:/root/.rbenv/bin:/root/.rbenv/shims
RUN cd /root/.rbenv/plugins/ruby-build && git pull && cd -
ENV RUBY_VERSION 2.7.3
RUN rbenv install $RUBY_VERSION && rbenv global $RUBY_VERSION && rbenv rehash
RUN echo 'gem: --no-rdoc --no-ri' >> /.gemrc
RUN gem install bundler:2.2.16

# Install Chrome WebDriver
RUN apt-get update && apt-get install -y apt-transport-https ca-certificates
RUN CHROMEDRIVER_VERSION=$(curl https://chromedriver.storage.googleapis.com/LATEST_RELEASE) && \
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

COPY . /smoke

# Install Nokogiri
RUN apt-get update && \
	apt-get install -y pkg-config libxslt-dev libxml2-dev && \
	gem install nokogiri -- --use-system-libraries

RUN cd smoke && bundle install

WORKDIR "/smoke"
CMD ["bundle", "exec", "rspec", "--format", "documentation"]