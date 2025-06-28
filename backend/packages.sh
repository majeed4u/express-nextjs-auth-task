#!/bin/bash


packages="jsonwebtoken bcrypt express dotenv nodemon zod prisma @prisma/client typescript ts-node"
typescript_packages="@types/jsonwebtoken @types/bcrypt @types/express @types/dotenv @types/nodemon "

echo $typescript_packages
echo $packages
npm install $packages
npm install -D $typescript_packages

