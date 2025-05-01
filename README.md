# SLMS Front End

## Overview

The **Site Leveling Management System (SLMS) Front End** is a web application designed to manage construction projects, resources, and progress tracking. It supports various roles, including Admins, Business Employees, Construction Managers, Technical Managers, Resource Managers, Quality Assurance personnel, and the Executive Board. The application provides an intuitive interface for creating projects, approving plans, managing resources, and viewing inspection reports, ensuring efficient collaboration across teams.

## Project Goals

- Build a user-friendly interface for managing construction projects and resources.
- Enable seamless interaction between users (e.g., Admins, Construction Managers) and the SLMS Back End for data operations.
- Provide real-time updates on project progress, resource allocation, and inspection reports.
- Ensure scalability and maintainability for future enhancements.

## Technologies Used

- **Vue.js**: Framework for building a responsive and dynamic user interface.
- **Element Plus**: UI component library for Vue.js, offering pre-built components like tables, forms, and modals.
- **Axios**: Handles HTTP requests to the SLMS Back End.
- **Vue Router**: Manages navigation between pages (e.g., Dashboard, Project Details).
- **Vuex** (optional): State management for handling global data (e.g., user sessions).
- **Node.js & npm**: Manages dependencies and runs the development server.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) and **npm**.
- SLMS Back End running locally or deployed at : `https://sep490-backend-api.azurewebsites.net/`
## Installation

Follow these steps to set up the project locally:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/slms-frontend.git
   cd slms-frontend
2. Install Dependencies
    ```bash
    npm install
3. Confingure Environment Variables
- Create a `.env` file in the root directory
- Add the API URL and other confingurations
    ```
    VITE_PORT=
    VITE_SERVER_URL=
    VITE_FRONTEND_URL=
    VITE_COOKIE_EXPIRE_TIME=365
    VITE_APP_FORMATDATE=YYYY-MM-DD
## Running the Project
1. Start the Development Server
    ```bash
    npm run dev
2. Access the applicaiton
    Open your browser and navigate to : `http://localhost:9999`

## Project Struture
![alt text](image.png)
## Screenshots
Below are some example screenshots of the SLMS FrontEnd:
- DashBoard![alt text](image-1.png)
- Process: ![alt text](image-2.png)
- Inspection Report: ![alt text](image-3.png)
## Acknowledgments
- Thank for Vue.js and Element Plus communities for their amazing tools and document
- Special appreciation to the SLMS BackEnd team for their api support

## Contact
For issues or inquiries, please reach out to the team at `chiendqhe170223@fpt.edu.vn` or `khanhndhe173559@fpt.edu.vn`


