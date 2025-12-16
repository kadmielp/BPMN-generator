# BPMN Diagram Generator

This web application leverages the Google Gemini AI to generate Business Process Model and Notation (BPMN) 2.0 diagrams from natural language descriptions. Users can input a description of a business process, and the AI will produce the corresponding BPMN XML, which is then rendered visually in the browser.

## Features

- **AI-Powered Diagram Generation**: Utilizes the Google Gemini API to understand process descriptions and create BPMN 2.0 XML.
- **Interactive BPMN Viewer**: Renders the generated diagrams using the powerful `bpmn-js` library.
- **Real-time Feedback**: Displays a loading state while the AI is generating the diagram and provides clear error messages.
- **Modern UI**: A clean, responsive interface built with React and styled with a dark theme.

## Tech Stack

- **Frontend**: [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **AI**: [Google Gemini API](https://ai.google.dev/)
- **BPMN Rendering**: [bpmn-js](https://bpmn.io/)

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A Google Gemini API Key. You can obtain one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/kadmielp/BPMN-generator.git
    cd BPMN-generator
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a new file named `.env.local` in the root of your project directory. This file will hold your secret API key.

    ```
    touch .env.local
    ```

    Open the `.env.local` file and add your Google Gemini API key as follows:

    ```env
    # .env.local
    API_KEY="YOUR_GEMINI_API_KEY"
    ```
    Replace `YOUR_GEMINI_API_KEY` with your actual key.

    *Note: The `bpmn-js` library and its stylesheets are loaded via a CDN in `index.html`, so no separate installation is required for it.*

### Running the Application

Once the setup is complete, you can run the development server:

```bash
npm run dev
```

This will start the Vite development server, and you can view the application by navigating to `http://localhost:5173` (or the URL provided in your terminal).

## How to Use

1.  Open the application in your web browser.
2.  In the "Process Description" text area, type a clear description of the business process you want to visualize. A default example is provided to get you started.
3.  Click the **"Generate Diagram"** button.
4.  The application will show a loading indicator while the AI processes your request.
5.  Once complete, the generated BPMN diagram will appear on the right-hand side of the screen.

## Project Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Bundles the application for production.
- `npm run preview`: Serves the production build locally for previewing.