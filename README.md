TechCheck
A site to sell and buy used electronic goods. A seller can upload a item to be sold on the site. The item must pass a simple picture check by our team to make sure that the item is not broken/ or unfit to be sold on the site. When the buyer wants to buy the item the seller will be notified and then will ship the item to our facility to be checkout by our team f experts. If the item passes the rigorous testing process the item will be shipped to the buyer. If it does not pass the tests it will be shipped back to the seller.

Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.
To start you need to make .env.local file to set up the sql database connection. example 
```
DB_HOST=127.0.0.1
DB_USERNAME=root
DB_PASSWORD=ChangeMe123
DB_SCHEMA=example_db
DB_DIALECT=mysql
```
then run a yarn command(if you do not have yarn installed, run npm install -g yarn) then run yarn watch to start react and express server. 

To use the email service you must get a sendgrid account(free trial online) and paste the code to a file named 
sendgrid.js 
```
const sendgridkey = 'paste code here '
export default sendgridkey;
```
you must also create a jwtSecret file for JSON webToken code 
you must name the file jwtSecret.js
```
const jwtSecret ='make up any string'
export default jwtSecret;
```
for using the photos we have used Amazon Web Services
to view the files already on our you do not need to do anything but to upload on local you must create an account and get a key and secret.
name it awskey.js
```
const s3key='paste key here'
export default s3key;

name it awssecret.js
```
const secret = 'paste secret code'
export default secret;
```

Prerequisites
You must have react and node.js installed on your computer to run this app


Built With
React.js
Node.js
Express
Sequelize
Material-ui
SQL
AWS
Sendgrid

Contributing and GitHub username
David Horn-hornd24
Daniel Oh-danniboi82
Andrew Nguyen-weboshi
Padma Ramani-Padmaramani
Kevin Lee-timpaniman



Authors
David Horn-head back-end
Daniel Oh-head front end
Andrew Nguyen-Amazon Web Services and front end 
Padma Ramani-head search engine function
Kevin Lee-cart and Paypal

License
This project is licensed under the MIT License - see the LICENSE.md file for details

