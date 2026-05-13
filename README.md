# HeavyHire 🚜

HeavyHire is a comprehensive MERN stack application designed for renting heavy machinery and vehicles. It provides a seamless experience for users to book equipment, for owners to manage their fleet, and for administrators to oversee the entire platform.

## 🌟 Features

- **Role-Based Access Control**: Separate dashboards and functionalities for **Users**, **Owners**, and **Admins**.
- **Real-Time Bookings**: Integrated with Socket.IO for live updates on booking status and availability.
- **Vehicle Management**: Owners can list, update, and manage their heavy machinery with ease.
- **Image Uploads**: Integrated with Cloudinary for high-quality image storage and delivery.
- **Booking Flow**: Streamlined process for selecting dates/times and booking equipment.
- **Reviews & Ratings**: Users can leave feedback on their rental experience.
- **Responsive UI**: Built with React and Tailwind CSS for a premium, mobile-friendly experience.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Lucide Icons, Socket.io-client.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Authentication**: JWT & Bcryptjs.
- **File Storage**: Cloudinary & Multer.
- **Real-time Communication**: Socket.IO.

## 🚀 Getting Started

### Prerequisites

- Node.js installed
- MongoDB (Local or Atlas)
- Cloudinary Account (for image uploads)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Anshulsharma52/HeavyHire.git
   cd HeavyHire
   ```

2. **Setup Server:**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory and add the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. **Setup Client:**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start Backend Server:**
   ```bash
   cd server
   npm run dev
   ```

2. **Start Frontend Development Server:**
   ```bash
   cd client
   npm run dev
   ```

The application should now be running. Access the frontend at the URL provided by Vite (usually `http://localhost:5173`).

## 📁 Project Structure

```text
HeavyHire/
├── client/          # React frontend (Vite)
│   ├── src/         # Components, Pages, Assets
│   └── public/      # Static files
├── server/          # Node.js backend
│   ├── config/      # Database configuration
│   ├── controllers/ # Route handlers
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API endpoints
│   ├── middleware/  # Auth & Upload middleware
│   └── socket.js    # Socket.IO configuration
└── README.md
```

## 📄 License

This project is licensed under the ISC License.
