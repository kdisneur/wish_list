#! /bin/sh

BASE_DIR=$(dirname $0)

echo "Enter your Mongolab API key: "
read api_key
echo "Enter your Mongolab databse name: "
read db_name

echo "MONGODB_SETTINGS = {
  api_key: '${api_key}',
  db_name: '${db_name}',
}" > ${BASE_DIR}/javascripts/settings.js

echo "AuthUserFile /app/www/.htpasswd
AuthType Basic
AuthName \"Restricted Access\"
Require valid-user" > ${BASE_DIR}/.htaccess

echo "Now, we are going to allow some users"
echo "Enter a login"
read user
touch .htpasswd
while [ "${user}" != "" ]; do
  htpasswd .htpasswd ${user}
  echo "Enter a login (empty login to exit)"
  read user
done

echo "Configuration successfully finished"
