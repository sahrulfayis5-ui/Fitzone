# FitZone Gym - Express.js Application

A modern gym website built with Express.js, Handlebars templates, and MongoDB database.

## Features

- Modern, responsive design
- Member registration system
- MongoDB database integration
- Handlebars templating engine
- Express.js server

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

## Installation

1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```
   MONGODB_URI=mongodb://localhost:27017/fitzone-gym
   PORT=3000
   ```

4. Start MongoDB (if running locally):
   ```bash
   mongod
   ```

5. Run the application:
   ```bash
   npm start
   ```

   For development with auto-restart:
   ```bash
   npm run dev
   ```

6. Open your browser and go to `http://localhost:3000`

## Project Structure

```
├── app.js                 # Main application file
├── package.json           # Dependencies and scripts
├── models/
│   └── Member.js         # Member data model
├── routes/
│   ├── index.js          # Home and contact routes
│   └── members.js        # Member-related routes
├── views/
│   ├── layouts/
│   │   └── main.hbs      # Main layout template
│   ├── home.hbs          # Home page template
│   ├── members.hbs       # Members page template
│   ├── contact.hbs       # Contact page template
│   └── error.hbs         # Error page template
└── public/
    └── css/
        └── style.css     # Stylesheet
```

## Usage

- **Home Page**: Visit `/` to see the main landing page
- **Members**: Visit `/members` to register as a member or view existing members
- **Contact**: Visit `/contact` to see contact information

## Database Schema

### Member Model
- `name`: String (required)
- `email`: String (required, unique)
- `phone`: String (required)
- `membershipType`: String (enum: 'basic', 'premium', 'vip')
- `joinDate`: Date (default: current date)
- `isActive`: Boolean (default: true)

## Technologies Used

- **Express.js**: Web framework
- **Handlebars**: Templating engine
- **MongoDB**: Database
- **Mongoose**: MongoDB object modeling
- **Body-parser**: Request parsing middleware
- **Dotenv**: Environment variable management

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License.

