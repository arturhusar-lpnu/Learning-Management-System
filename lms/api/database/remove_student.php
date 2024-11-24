<?php 
function remove_student_from_db($conn, $id) {
    $sql = "DELETE FROM users WHERE id = ?";
    $stmt = $conn->prepare($sql);
    try {
        $stmt->execute([$id]);
        if($stmt->rowCount() > 0) {
            $response = array('success' => "Student was removed.",
            'id' => "$id");
        }
        else {
            $response = array('error' => "No student found with ID: $id");
        }
    } catch (PDOException $e) {
        $response = array("error" => $e->getMessage());
    }
    return $response;
}


function server_connect_response() {
    $jsonData = file_get_contents('php://input');
    $id = json_decode($jsonData, true);
    
    try{
        $conn = new PDO("mysql:host=localhost;dbname=cms_students", "root", "");
        $response = array('success' => "Connected successfully"); 
    } 
    catch(PDOException $e){
        $response = array('error' => "Connection failed: " . $e->getMessage());
        $jsonResponse = json_encode($response);
        echo $jsonResponse; 
        return;
    }

    if(!isset($id)) {
        $response = array('error' => "No data set");
        $jsonResponse = json_encode($response);
        echo $jsonResponse;
        return;
    }
    
    $response = remove_student_from_db($conn, $id);
    $jsonResponse = json_encode($response);
    echo $jsonResponse;
}
server_connect_response();
?>