# Editor-Pro

This project is a web application that combines Express.js/Node.js on the backend and React on the frontend, utilizing several libraries for enhanced functionality. It integrates Socket.IO for real-time communication, MongoDB for data storage, Nodemailer for email functionality, and leverages Tailwind CSS and Sass for styling.

## Live Site

For a live demonstration of the project, you can visit the [Editor-Pro Live Site](https://editor-pro.onrender.com). Experience the seamless collaboration and document editing features firsthand.

## Testing Credentials

To test the application's functionality, you can use the following testing credentials:

Email: `test@mail.com`

Password: `12345678`

Please note that these credentials are only for testing purposes and should not be used for personal purposes and user itself will be responsible for any kind of data loss or leak.

## Usage

1. Login using the provided testing credentials or register as a new user and login with the newly created credentials.![](https://github.com/HarshRajGupta/editor-pro/assets/85221003/68a7b2da-9595-4530-abcc-c0b1e61e82ce)

2. After logging in, you will see a list of documents that were created by you or shared with you.![](https://github.com/HarshRajGupta/editor-pro/assets/85221003/4cd88ef0-ddc5-44b9-aa52-fac4902cf8eb)

3. To create a new document, fill in the file name, select its type, and click on the "New File" button.![](https://github.com/HarshRajGupta/editor-pro/assets/85221003/8a8ae5dc-75da-4f96-8bc3-a86d812fb4a7)

4. To open an already created document, simply click on the document in the list.![](https://github.com/HarshRajGupta/editor-pro/assets/85221003/034cb671-eae8-46fb-966a-a5daf7777bb6)

5. To invite other collaborators, click on the "Share" button at the top and provide their email addresses.![](https://github.com/HarshRajGupta/editor-pro/assets/85221003/b8f82cb1-9ecf-4677-8ec8-1f006584f068)

6. Only the original creator of a file can make the document open to all or restrict access, as well as delete the document.

7. For compilation, fill in the input in the custom input box and press the "Compile" button. You can also change the programming language if needed. The output will be displayed in the output box on the right side.![](https://github.com/HarshRajGupta/editor-pro/assets/85221003/d6fbb7c8-f667-4209-ac4f-7ff42809a6d1)

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
npm install
```

or

```shell
yarn
```

4. Install the dependencies for the frontend.

```shell
cd client
npm install
```

or

```shell
cd client
yarn
```

### Configuration

1. In the root folder, create a `.env` file based on the provided `.env.sample` file. Configure any necessary environment variables specific to the server, including the MongoDB connection details and email server credentials.

2. In the `client` folder, create a `.env` file based on the provided `.env.sample` file. Configure any necessary environment variables specific to the client.

### Starting the Application

To start the application, perform the following steps:

1. Start the backend server.

```shell
npm start
```

or

```shell
yarn start
```

2. The web interface will be accessible at [http://localhost:4000](http://localhost:4000) in your web browser.

### Starting the Application (for development)

To start the application, perform the following steps:

1. Start the backend server.

```shell
npm run dev
```

or

```shell
yarn dev
```

1. In a separate terminal window, navigate to the client folder and start the frontend development server.

```shell
cd client
npm start
```

or

```shell
cd client
yarn start
```

2. The web interface will be accessible at [http://localhost:4000](http://localhost:4000) in your web browser.

## Acknowledgments

We would like to express our sincere gratitude to the following libraries and APIs that have greatly contributed to the development of this project:

- **Judge0 API** (provided by Rapid API): The powerful compilation environment offered by Judge0 API has been instrumental in enabling seamless code compilation and execution.

- **Socket.IO**: The real-time communication capability provided by Socket.IO has transformed the collaborative experience, allowing users to collaborate and edit documents simultaneously.

- **Monaco Editor by Microsoft**: The feature-rich and highly customizable Monaco Editor has elevated the code editing experience, providing users with a sophisticated and intuitive interface.

- **TinyMCE**: We extend our appreciation to TinyMCE for its robust and versatile document editing environment, empowering users to create and format rich-text documents effortlessly.

- **React-md-editor**: The React-md-editor library deserves special recognition for its seamless integration and comprehensive markdown editing features, enabling users to compose and preview markdown content with ease.

We extend our heartfelt thanks to the creators and contributors of these exceptional libraries and APIs for their dedication and commitment to building remarkable tools that have significantly enhanced the functionality and user experience of our project.
