<?php
session_start();

// Database connection configuration
$host = "localhost";
$username = "root";
$password = "";
$dbname = "user_auth";

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create users table if it doesn't exist
    $conn->exec("CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Handle registration
if (isset($_POST['registro']) && $_POST['registro'] == '1') {
    $name = filter_input(INPUT_POST, 'nombre', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    
    try {
        $stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (:name, :email, :password)");
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $password);
        
        if ($stmt->execute()) {
            $_SESSION['message'] = "Registration successful! Please login.";
            header("Location: ../Maqueta/login.html");
            exit();
        }
    } catch(PDOException $e) {
        if ($e->getCode() == 23000) {
            $_SESSION['error'] = "Email already exists!";
        } else {
            $_SESSION['error'] = "Registration failed: " . $e->getMessage();
        }
        header("Location: ../Maqueta/login.html");
        exit();
    }
}

// Handle login
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !isset($_POST['registro'])) {
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'];
    
    try {
        $stmt = $conn->prepare("SELECT * FROM users WHERE email = :email");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['name'];
            $_SESSION['message'] = "Login successful!";
            header("Location: ../Maqueta/home.html");
            exit();
        } else {
            $_SESSION['error'] = "Invalid email or password!";
            header("Location: ../Maqueta/login.html");
            exit();
        }
    } catch(PDOException $e) {
        $_SESSION['error'] = "Login failed: " . $e->getMessage();
        header("Location: ../Maqueta/login.html");
        exit();
    }
}

$conn = null;
?>