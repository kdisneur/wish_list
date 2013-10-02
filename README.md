# Wish list

A simple application storing your wishes ordered by priority. Now, you can manage your budget more easily.

This app is not a service. If you want to use this app, deploy it on your own server.

## Heroku Installation

* Create an account and a database on [MongoLab](https://mongolab.com/welcome/)
* Create an account and an application on [Heroku](https://www.heroku.com/)
* Run `git clone git@github.com:kdisneur/wish_list`
* Run `cd wish_list`
* Run `./bootsrap.sh` to generate a settings file (MongoDB authentication) and an htaccess (to protect your application)
* Add Heroku remote `git remote add heroku git@heroku.com:<YOUR_HEROKU_APP>.git`
* And you can push your application `git push heroku`
