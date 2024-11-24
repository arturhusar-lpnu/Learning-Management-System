<?php
$dsn = 'mysql:host=localhost;dbname=cms_students';
$username = 'root';
$password = '';

try {
    $conn = new PDO($dsn, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo ("Connection failed: " . $e->getMessage());
}

$sql = "SELECT * FROM users";
$stmt = $conn->prepare($sql);
$stmt->execute();
$students = $stmt->fetchAll(PDO::FETCH_ASSOC);
$jsonData = json_encode($students);

echo $jsonData;
?>