<!-- @format -->

# NodeJS Microservice on AWS ECS

## Overview

This repository contains a NodeJS microservice deployed on AWS ECS. The microservice is composed of two main services:

1. **User Service**: Manages user-related operations such as registration, authentication, and user profile management.
2. **Books Service**: Manages book-related operations such as adding new books, updating book information, and retrieving book details.

Based on watching this video -- https://www.youtube.com/watch?v=sKPVRF9sBQo

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Microservice](#running-the-microservice)
- [Deployment](#deployment)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you begin, ensure you have the following:

- NodeJS (v15 or later)
- npm (v8 or later)
- Docker
- AWS CLI configured with appropriate permissions
- An AWS ECS cluster

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/jdavault/lab-files-ms-node-js
   cd your-repo
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

## Configuration

1. Create a `.env` file in the root directory and add the necessary environment variables:

   ```env
   PORT=3000
   AWS_ACCESS_KEY_ID=your-access-key-id
   AWS_SECRET_ACCESS_KEY=your-secret-access-key
   ```

2. Configure AWS ECS settings in the `ecs-config.json` file:

   ```json
   {
     "cluster": "your-cluster-name",
     "serviceName": "your-service-name",
     "taskDefinition": "your-task-definition",
     "containerName": "your-container-name"
   }
   ```

## Running the Microservice

1. Start the services locally:

   ```sh
   npm start
   ```

2. The User Service will be accessible at `http://localhost:3000/api/users`
3. The Books Service will be accessible at `http://localhost:3000/api/books`

## Deployment

1. Build the Docker image:

   ```sh
   docker build -t jdavault/testingecs .

   ```

2. Push the image to your container registry (e.g., Docker Hub, AWS ECR):

   ```sh
   docker tag testingecs:latest jdavault/testingecs:latest
   docker push jdavault/testingecs:latest
   ```

3. Update the ECS service to use the new image:

   ```sh
   aws ecs update-service --cluster mb2-ecs-cluster --service mb2-ecs-service --force-new-deployment
   ```

## Usage

- To create a new user, send a POST request to `http://localhost:3000/api/users`.
- To authenticate a user, send a POST request to `http://localhost:3000/api/users/authenticate`.
- To add a new book, send a POST request to `http://localhost:3000/api/books`.
- To retrieve book details, send a GET request to `http://localhost:3000/api/books/:bookId`.

## API Endpoints

### User Service

- **POST /users**: Create a new user
- **POST /users/authenticate**: Authenticate a user
- **GET /users/:userId**: Get user details

### Books Service

- **POST /books**: Add a new book
- **GET /books/:bookId**: Get book details
- **PUT /books/:bookId**: Update book details
- **DELETE /books/:bookId**: Delete a book

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
