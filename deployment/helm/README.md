# Installing with the Helm chart
**Note: this functionality is new and should be considered beta for now**

This Helm chart installs Postfacto and its dependencies. 

# Evaluation install
Start with this simplified install if you just want to try out Postfacto, skip to the production install
section if you want to run an instance for real. 

1. Download the chart from the [releases page](https://github.com/pivotal/postfacto/releases)  

1. Run the chart:
    ```shell script
    helm install postfacto <downloaded-chart.tgz>
    ```
    If you will be running in an environment that doesn't support HTTPS, you will need to turn off the automatic redirect with the `disableSSLRedirect option`

1. Create an admin user so you can access the admin console
    ```shell script
    kubectl get pods
    # Take note of the postfacto pod name
    kubectl exec <pod name> create-admin-user <admin-email> <admin-password> 
    ```
   
You should now have a Postfacto running in k8s, you can head to the /admin path to 
create a retro then to /retros/<retro-name> to start using it. 

This is a reasonable installation if you don't plan on upgrading or allowing other users
to sign up and create retros, for that, read on to see a few more options you need to set. 

## Production Install 
The steps here are the same as the evaluation install, you just need to set a few more options (either 
by passing them through using the --set command or --values with a file)

### Passwords
The first thing to do is to pick passwords for the redis and postgres, this is required for upgrades, 
otherwise the sub charts will attempt to generate a new password which won't actually work.
* `redis.password=<redis-password>`
* `postgresql.postgresqlPassword=<postgresql-password>`

### Letting other users register
Postfacto can allow users to register with google and then create retros themselves, to do this you need to
provice a google oAuth client ID, you can follow [this guide](https://developers.google.com/identity/protocols/OAuth2UserAgent) 
up until generating scopes to get a client id to provide in this parameter: 

* `googleOAuthClientId=<client-id>`

### Keeping users logged in between upgrades
An out of the box install will invalidate sessions after each upgrade, to stop this provide a secret key base
that is the same across upgrades:

* `secretKeyBase=<random-long-value>`


# Upgrading
Upgrading is similar to installing, make sure you provide the same passwords 
for redis and postgres as well as any other configuration
```shell script
helm upgrade postfacto . \
  --set redis.password=<redis-password> \
  --set postgresql.postgresqlPassword=<postgresql-password> 
```

# Parameters

## Postfacto parameters

Parameter | Description | Default
----------|-------------|--------
googleOAuthClientId  | The Google oAuth client ID to use to allow users to log in using a google account | nil   
disableSSLRedirect  | By default Postfacto redirects to HTTPS by default, setting this to true disables that behaviour and can be useful when getting started | nil   
secretKeyBase | Used for signing and encryption, should be set to a random value | random 10 character alpha numeric string

## Subcharts
This chart includes the following subcharts: 
* [redis](https://github.com/bitnami/charts/tree/master/upstreamed/redis)
* [postgresql](https://github.com/bitnami/charts/tree/master/upstreamed/postgresql)

All options are documented for these are documented in the above links and can be customized
by providing the value prefixed with the chart name. For example to modify the `postgresqlDataDir` 
option for postgres you would add the following to the install/upgrade command

```shell script
--set postgresql.postgresqlDataDir=<new-data-dir>
```


# Building the chart

To build and run the chart locally, follow the following steps

1. Install Helm CLI (version 3+)
1. Add stable chart repository to helm
    ```shell script
    helm repo add stable https://kubernetes-charts.storage.googleapis.com
    ```
1. Download subcharts:
    ```shell script
    helm dep build
    ```
1. Build the chart: 
    ```shell script
    helm package
    ```