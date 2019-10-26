# Build & Install

To build and run the chart locally, follow the following steps

1. Install Helm CLI (version 3+)
2. Add stable chart repository to helm
```shell script
helm repo add stable https://kubernetes-charts.storage.googleapis.com
```
3. Download subcharts:
```shell script
helm dep build
```
4. Run the chart choosing some passwords for the redis and mysql installs 
as well as your google oauth client id. You can omit this if you are just 
going to create retros through the admin dashboard
```shell script
helm install postfacto . \
  --set redis.password=<redis-password> \
  --set postgresql.postgresqlPassword=<postgresql-password> \
  --set googleOAuthClientId=<client-id>
```
5. Optionally create an admin user if you need to access the admin console
```shell script
kubectl get pods
# Take note of the postfacto pod ID
kubectl exec <podID> create-admin-user <email> <password> 
```

# Upgrading
Upgrading is similar to installing, make sure you provide the same passwords 
for redis and postgres as well as any other configuration
```shell script
helm upgrade postfacto . \
  --set redis.password=<redis-password> \
  --set postgresql.postgresqlPassword=<postgresql-password> \
  --set googleOAuthClientId=<client-id>
```

# Parameters

## Postfacto parameters

Parameter | Description | Default
----------|-------------|--------
googleOAuthClientId  | The Google oAuth client ID to use to allow users to log in using a google account | nil   

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