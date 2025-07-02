# GoRide API Documentation

## Overview

GoRide is a ride-sharing application with a Node.js backend API. This documentation covers the available endpoints and their usage.

## Base URL

```
http://localhost:{PORT}/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### User Registration

**Endpoint:** `POST /user/register`

**Description:** Creates a new user account in the system. The endpoint validates user input, checks for existing users, hashes the password, and returns a JWT token for authentication.

**Status Codes:**

- `201 Created` - User successfully created
- `400 Bad Request` - Validation errors or missing required fields
- `409 Conflict` - User with the provided email already exists
- `500 Internal Server Error` - Server error during user creation

**Request Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "fullName": {
    "firstName": "string (min 3 characters)",
    "lastName": "string (min 3 characters)"
  },
  "email": "string (valid email format)",
  "password": "string (min 6 characters)"
}
```

**Required Fields:**

- `fullName.firstName` - User's first name (minimum 3 characters)
- `fullName.lastName` - User's last name (minimum 3 characters)
- `email` - User's email address (must be valid email format)
- `password` - User's password (minimum 6 characters)

**Validation Rules:**

- First name must be at least 3 characters long
- Last name must be at least 3 characters long
- Email must be in valid email format
- Password must be at least 6 characters long
- All fields are required

**Success Response (201):**

```json
{
  "message": "User created successfully",
  "user": {
    "_id": "user_id",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  },
  "token": "jwt_token_string"
}
```

**Error Response (400) - Validation Error:**

```json
{
  "errors": [
    {
      "type": "field",
      "value": "jo",
      "msg": "First Name must be at least 3 characters long",
      "path": "fullName.firstName",
      "location": "body"
    }
  ]
}
```

**Error Response (409) - User Already Exists:**

```json
{
  "message": "User already exists"
}
```

**Example Request:**

```bash
curl -X POST http://localhost:{PORT}/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

**Example Response:**

```json
{
  "message": "User created successfully",
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### User Login

**Endpoint:** `POST /user/login`

**Description:** Authenticates an existing user by validating their email and password. If successful, returns a JWT token for subsequent API access.

**Status Codes:**

- `200 OK` - Login successful
- `400 Bad Request` - Validation errors or missing required fields
- `401 Unauthorized` - Invalid email or password
- `500 Internal Server Error` - Server error during authentication

**Request Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "string (valid email format)",
  "password": "string (min 6 characters)"
}
```

**Required Fields:**

- `email` - User's email address (must be valid email format)
- `password` - User's password (minimum 6 characters)

**Validation Rules:**

- Email must be in valid email format
- Password must be at least 6 characters long
- Both fields are required

**Success Response (200):**

```json
{
  "message": "Login successful",
  "user": {
    "_id": "user_id",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  },
  "token": "jwt_token_string"
}
```

**Error Response (400) - Validation Error:**

```json
{
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    }
  ]
}
```

**Error Response (401) - Invalid Credentials:**

```json
{
  "message": "Invalid email or password"
}
```

**Example Request:**

```bash
curl -X POST http://localhost:{PORT}/api/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

**Example Response:**

```json
{
  "message": "Login successful",
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get User Profile

**Endpoint:** `GET /user/profile`

**Description:** Returns the profile of the currently authenticated user. Requires a valid JWT token.

**Status Codes:**

- `200 OK` - User profile fetched successfully
- `401 Unauthorized` - Missing or invalid token

**Request Headers:**

```
Authorization: Bearer <jwt-token>
```

**Success Response (200):**

```json
{
  "message": "User profile fetched successfully",
  "user": {
    "_id": "user_id",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  }
}
```

**Error Response (401):**

```json
{
  "message": "Unauthorized"
}
```

**Example Request:**

```bash
curl -X GET http://localhost:{PORT}/api/user/profile \
  -H "Authorization: Bearer <jwt-token>"
```

### User Logout

**Endpoint:** `GET /user/logout`

**Description:** Logs out the currently authenticated user by blacklisting their JWT token and clearing the authentication cookie. Requires a valid JWT token.

**Status Codes:**

- `200 OK` - Logged out successfully
- `401 Unauthorized` - Missing or invalid token

**Request Headers:**

```
Authorization: Bearer <jwt-token>
```

**Success Response (200):**

```json
{
  "message": "Logged out successfully"
}
```

**Error Response (401):**

```json
{
  "message": "Unauthorized"
}
```

**Example Request:**

```bash
curl -X GET http://localhost:{PORT}/api/user/logout \
  -H "Authorization: Bearer <jwt-token>"
```

## Captain Endpoints

### Captain Registration

**Endpoint:** `POST /captain/register`

**Description:** Registers a new captain (driver) in the system with their vehicle information. The endpoint validates all required fields, checks for existing captains, hashes the password, and returns a JWT token for authentication.

**Status Codes:**

- `201 Created` - Captain successfully registered
- `400 Bad Request` - Validation errors, missing required fields, or captain already exists
- `500 Internal Server Error` - Server error during captain registration

**Request Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "fullName": {
    "firstName": "string (required)",
    "lastName": "string (optional)"
  },
  "email": "string (valid email format)",
  "password": "string (min 6 characters)",
  "vehicle": {
    "vehicleType": "car|bike|auto",
    "vehicleModel": "string (required)",
    "vehicleCapacity": "number (min 1)",
    "color": "string (required)",
    "numberPlate": "string (required)"
  }
}
```

**Required Fields:**

- `fullName.firstName` - Captain's first name (required)
- `fullName.lastName` - Captain's last name (optional)
- `email` - Captain's email address (must be valid email format)
- `password` - Captain's password (minimum 6 characters)
- `vehicle.vehicleType` - Type of vehicle (must be "car", "bike", or "auto")
- `vehicle.vehicleModel` - Model of the vehicle (required)
- `vehicle.vehicleCapacity` - Passenger capacity (minimum 1)
- `vehicle.color` - Color of the vehicle (required)
- `vehicle.numberPlate` - Vehicle's number plate (required)

**Validation Rules:**

- First name is required
- Last name is optional
- Email must be in valid email format
- Password must be at least 6 characters long
- Vehicle type must be one of: "car", "bike", "auto"
- Vehicle model is required
- Vehicle capacity must be at least 1
- Vehicle color is required
- Number plate is required

**Success Response (201):**

```json
{
  "message": "Captain registered successfully",
  "captain": {
    "_id": "captain_id",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "vehicle": {
      "vehicleType": "car",
      "vehicleModel": "Toyota Camry",
      "vehicleCapacity": 4,
      "color": "White",
      "numberPlate": "ABC123"
    }
  },
  "token": "jwt_token_string"
}
```

**Error Response (400) - Validation Error:**

```json
{
  "errors": [
    {
      "type": "field",
      "value": "invalid-type",
      "msg": "Vehicle type must be car, bike, or auto",
      "path": "vehicle.vehicleType",
      "location": "body"
    }
  ]
}
```

**Error Response (400) - Captain Already Exists:**

```json
{
  "message": "Captain already exists"
}
```

**Example Request:**

```bash
curl -X POST http://localhost:{PORT}/api/captain/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "password": "password123",
    "vehicle": {
      "vehicleType": "car",
      "vehicleModel": "Toyota Camry",
      "vehicleCapacity": 4,
      "color": "White",
      "numberPlate": "ABC123"
    }
  }'
```

**Example Response:**

```json
{
  "message": "Captain registered successfully",
  "captain": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "vehicle": {
      "vehicleType": "car",
      "vehicleModel": "Toyota Camry",
      "vehicleCapacity": 4,
      "color": "White",
      "numberPlate": "ABC123"
    }
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt
- **Validation:** express-validator

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (JWT_SECRET, MONGODB_URI)
4. Start the server: `npm start`

## Environment Variables

- `JWT_SECRET` - Secret key for JWT token generation
- `MONGODB_URI` - MongoDB connection string
