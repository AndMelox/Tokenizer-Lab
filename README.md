# Tokenizing-Lab

This project consists of a distributed tokenization service that includes a discovery server, a middleware, and a tokenizer. Instructions for setting up and running the project are provided below.

## Requirements

- Node.js (version 18 or higher)
- Docker and Docker Compose


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file
### Discovery
`PORT=3002`
### Middleware
`MIDDLEWARE_PORT=3003`

`DISCOVERY_PORT=3002`

`DISCOVERY_HOST= 192.168.1.5`
### Tokenizer
`PORT=3012`

`HOST=192.168.1.5`

`IP_INSTANCE=192.168.1.5`

`DISCOVERY_PORT=3002`

`INSTANCE_ID=Tokenizer-4`



## Appendix

### 1. Clone the repository

* git clone <https://github.com/AndMelox/Tokenizer-Lab>
* cd <REPOSITORY_NAME>-- Where you want to Clone it on your device
### 2. Setting environment variables
* Discovery
Create a .env file in the Discovery folder with the following contents:

PORT=3002
* Middleware
Create a .env file in the Middleware folder with the following content:

MIDDLEWARE_PORT=3003

DISCOVERY_PORT=3002

DISCOVERY_HOST=192.168.1.5  # Change this IP to the IP of your machine
* Tokenizer
Create a .env file in the Tokenizer folder with the following content:

PORT=3012

HOST=192.168.1.5  # Change this IP to the IP of your machine

IP_INSTANCE=192.168.1.5  # Change this IP to the IP of your machine

DISCOVERY_PORT=3002 #Discovery Harbor

INSTANCE_ID=Tokenizer-4 #Identifier Name


### 3. Install dependencies
* Discovery
```bash
cd Discovery
```
```bash
npm install 
```
--And their proper directions, you will see them in the app.js files at the beginning of it
* Middleware
```bash
cd ../Middleware
```
```bash
npm install
```
* Tokenizer
```bash
cd ../Tokenizer
```
```bash
--npm install
```
## Deployment
1. Start the discovery server
```bash
cd Discovery
```
```bash
node app.js
```
2. Start the middleware
```bash
cd ../Middleware
```
```bash
node app.js
```
3. Starting the tokenizer with Docker Compose
```bash
cd ../Tokenizer
```
```bash
docker-compose up
```

--- Test with the client

Open the index.html file in your browser and test the tokenization service.

### Grades
If you are running the instances from another machine, make sure to change the IPs in the .env file in the Tokenizer folder.
Make sure the IPs configured in the .env files correspond to the IP of the machine each service is running on.

## Authors

[![GitHub](https://img.shields.io/badge/GitHub-@AndMelox-181717?style=flat-square&logo=github)](https://github.com/AndMelox)
[![GitHub](https://img.shields.io/badge/GitHub-@sebastian11020-181717?style=flat-square&logo=github)](https://github.com/sebastian11020)

## 🔗 Contact Links
[![instagram](https://img.shields.io/badge/instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/meloavellaneda/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/public-profile/settings?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_self_edit_contact-info%3BD4a%2FAg5dTVqxs%2Bgl%2FCwAuw%3D%3D)
[![gmail](https://img.shields.io/badge/gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:andrespipemelo@gmail.com)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://x.com/andresmelox)


