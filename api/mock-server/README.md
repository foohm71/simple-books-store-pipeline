# Mock Server

This directory contains a mock server for the Simple Books API.

## Running the Mock Server

1. **Install Prism CLI** (if not already installed):
   ```bash
   npm install -g @stoplight/prism-cli
   ```

2. **Start the Mock Server**:
   ```bash
   cd api/mock-server
   prism mock swagger.yaml
   ```

   This will start the mock server on `http://localhost:4010`.

3. **Test the API**:
   You can now send requests to the mock server. For example:
   ```bash
   curl http://localhost:4010/status
   ```

## Configuration

- The mock server uses the `swagger.yaml` file to define the API endpoints and responses.
- You can modify the `swagger.yaml` file to change the API behavior.

## Troubleshooting

- If you encounter any issues, ensure that the `swagger.yaml` file is correctly formatted.
- Check that the Prism CLI is installed and up-to-date. 