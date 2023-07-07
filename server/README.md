# Editor-Pro

This project is a web application that combines Express.js/Node.js on the backend and React on the frontend, utilizing several libraries for enhanced functionality. It integrates Socket.IO for real-time communication, MongoDB for data storage, Nodemailer for email functionality, and leverages Tailwind CSS and Sass for styling.

## Live Site

For a live demonstration of the project, you can visit the [Editor-Pro Live Site](https://editor-pro.onrender.com). Experience the seamless collaboration and document editing features firsthand.

## Usage

1. Login using the provided testing credentials or register as a new user and login with the newly created credentials.
2. After logging in, you will see a list of documents that were created by you or shared with you.
3. To create a new document, fill in the file name, select its type, and click on the "New File" button.
4. To open an already created document, simply click on the document in the list.
5. To invite other collaborators, click on the "Share" button at the top and provide their email addresses.
6. Only the original creator of a file can make the document open to all or restrict access, as well as delete the document.

7. For compilation, fill in the input in the custom input box and press the "Compile" button. You can also change the programming language if needed. The output will be displayed in the output box on the right side.

Please note that these usage instructions are a general guide, and the actual features and functionalities may vary based on the specific implementation of the application.

## Getting Started

To run the project locally, follow the steps below:

### Prerequisites

Make sure you have the following installed on your machine:

- Node.js: [Download and install Node.js](https://nodejs.org/en/download/)
- MongoDB: [Install MongoDB](https://docs.mongodb.com/manual/installation/)

### Installation

1. Clone the repository to your local machine.

```shell
git clone https://github.com/HarshRajGupta/editor-pro.git
```

2. Navigate to the project directory.

```shell
cd editor-pro
```

3. Install the dependencies for the backend.

```shell
cd server
npm install
```
or
```shell
cd server
yarn
```

4. Install the dependencies for the frontend.

```shell
cd ../client
npm install
```
or
```shell
cd ../client
yarn
```

### Configuration

1. In the `server` folder, create a `.env` file based on the provided `.env.sample` file. Configure any necessary environment variables specific to the server, including the MongoDB connection details and email server credentials.

2. In the `client` folder, create a `.env` file based on the provided `.env.sample` file. Configure any necessary environment variables specific to the client.

### Starting the Application

To start the application, perform the following steps:

1. In the `server` folder, start the backend server.
For Production
```shell
npm start
```
or
```shell
yarn start
```
For Development
```shell
npm run dev
```
or
```shell
yarn run dev
```

2. In a separate terminal window, navigate to the `client` folder and start the frontend development server.

```shell
cd ../client
npm start
```
or
```shell
cd ../client
yarn start
```

3. The frontend application will be accessible at [http://localhost:3000](http://localhost:3000) in your web browser.