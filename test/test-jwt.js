const jwt = require("jsonwebtoken");

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1OTNhODAwMy1lM2Y0LTQ3MGQtYjk3MS0zN2NjZTk0OWZmOGIiLCJlbWFpbCI6InByYWtoYXJhd2FzdGhpMzAyMDAyQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzY0MzQ2MzI5LCJleHAiOjE3NjQ5NTExMjl9.Wj5M55ZwmVy_E5mvLKcNC-5zT5iwg4WelrcJQwx3_4Q";

// Try verifying with your real backend secret:
jwt.verify(token, "your JWT secret here");
