rm -R -f ./migrations &&
pipenv run init &&
psql -U postgres -c "DROP DATABASE IF EXISTS prueba_api";
psql -U postgres -c "CREATE DATABASE prueba_api";
psql -U postgres -c "CREATE EXTENSION unaccent" -d prueba_api;
pipenv run migrate &&
pipenv run upgrade
