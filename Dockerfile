# Use a smaller Node.js base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/auth

# Copy only necessary files for dependency installation
COPY package*.json ./

# Install app dependencies and clean up unnecessary files in one layer
RUN npm install && \
    rm -rf package*.json

# Create necessary directories
RUN mkdir -p /usr/src/auth/app/models /usr/src/auth/app/config

# Copy the rest of the application code
COPY authServer.js .
COPY app/models/db.js app/models/
COPY app/config/db.js app/config/

# Expose the port your app runs on
EXPOSE 3309

# Define environment variables
ENV SERVER_DATABASE=3307
ENV REFRESH_TOKEN_SECRET=c0d24ee5dcf708dc0004a1f0e390aca8720bb2c7f1e4878b058a1cd7a37056b70130f726321152804e39fa664c564e1621427e97ff801e4e5dd3832a1db1ee0c
ENV ACCESS_TOKEN_SECRET=bdcdbdf616228d81ae19eac9c57e44a644015fc99a4a3155add5982c26e1ea1cd5c9c1f869988b039660c9057b6fbbdcc21378c838ac3827e438d18c0aa901d7
ENV REFRESH_TOKEN_EXPIRATION=60
ENV SERVER_AUTH_PORT=3309

# Command to run your application
CMD ["node", "authServer.js"]
