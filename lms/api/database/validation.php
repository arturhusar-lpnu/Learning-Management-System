<?php 
$db_host = "localhost";
$db_name = "cms_students";
$db_user = "root";
$db_pass = "";
class StudentData {
    public $group;
    public $firstName;
    public $lastName;
    public $gender;
    public $birthday;
    public $status;
    public $id;
    public $mode;
    static $count;
    public function generateID() {
        if(isset($this->birthday) == null) {
            return null;
        }
        $date = new DateTime($this->birthday);
        $year = $date->format('Y');
        $month = $date->format('M');
        $day = $date->format('D');
        $count = str_pad(StudentData::$count, 3, '0', STR_PAD_LEFT);
        $lastNameInitials = strtoupper(substr($this->lastName, 0, 3));
        $firstNameInitial = strtoupper(substr($this->firstName, 0, 1));
        StudentData::$count++;
        $this->id = $lastNameInitials . $firstNameInitial . $year . $month . $day . $count;
    }

    public function __construct($decodedData) {
        $this->group = isset($decodedData['student_group']) ? $decodedData['student_group'] : null;
        $this->firstName = isset($decodedData['first_name']) ? $decodedData['first_name'] : null;
        $this->lastName = isset($decodedData['last_name']) ? $decodedData['last_name'] : null;
        $this->gender = isset($decodedData['gender']) ? $decodedData['gender'] : null;
        $this->status = isset($decodedData['status']) ? $decodedData['status'] : null;
        $this->mode = isset($decodedData['mode']) ? $decodedData['mode'] : null;
        $this->birthday = isset($decodedData['birthday']) ? $decodedData['birthday'] : null;
        $this->id = isset($decodedData['id']) ? $decodedData['id'] : -1;
    }
}

function add_student_to_db($conn, $student) {
    $sql = "INSERT INTO users(`student_group`, `first_name`, `last_name`, `gender`, `birthday`, `status`, `id`)
        VALUES (?,?,?,?,?,?,?)";
    $stmt = $conn->prepare($sql);
    try {
        $stmt->execute([$student->group, $student->firstName, $student->lastName, $student->gender, $student->birthday,
        $student->status, $student->id]);
        $response = (array('success' => 'Successfully inserted data', 'id' => $student->id));
    } catch(PDOException $e) {
        $response = (array('error' => 'Error inserting data: ' . $e->getMessage()));
    }
    return $response;
}

function edit_student_in_db($conn, $student) {
    $sql = "UPDATE users 
            SET student_group = ?,
                first_name = ?,
                last_name = ?,
                gender = ?,
                birthday = ?,
                status = ?
            WHERE id = ?";
    $stmt = $conn->prepare($sql);
    try {
        $stmt->execute([$student->group, $student->firstName, $student->lastName, $student->gender, $student->birthday,
        $student->status, $student->id]);
        $response = array('success' => "Student information updated successfully.",
        'id' => "$student->id");
    } catch (PDOException $e) {
        $response = array("error" => $e->getMessage());
    }
    return $response;
}

function validate_data($decodedData) {
    
    if(!isset($decodedData)) {
        $response = array('error' => "Error: JSON data not received");
        return $response;
    }
    $student = new StudentData($decodedData);
    if (!ctype_alpha($student->firstName)) {
        $response['error'] = 'Error: First Name of student must contain only characters';
    }
    if (!ctype_alpha($student->lastName)) {
        $response['error'] = 'Error: Last Name of student must contain only characters';
    }
    $date = new DateTime($student->birthday);
    $year = $date->format('Y');
    if ($year > 2006) {
        $response['error'] = 'Error: Student must be at least 16 y.o';
    }
    if (empty($response)) {
        $response = array(
          'success' => "data is correct"
        );
    }
    return $response;
}

function call_curr_context($conn, $student) {
    if($student->mode == "add") {
        $student->generateID();
        $response = add_student_to_db($conn, $student);
    } elseif($student->mode == "edit") {
        $response = edit_student_in_db($conn, $student);
    }
    else {
        $response = array('error' => "Database error: Wrong mode being passed");
    }
    return $response;
}


function server_connect_response() {
    $jsonData = file_get_contents('php://input');
    $decodedData = json_decode($jsonData, true);
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
    $response = (validate_data($decodedData));
    if(isset($response['error'])) {
        $jsonResponse = json_encode($response);
        echo $jsonResponse;
        return;
    }
    $student = new StudentData($decodedData);

    $response += call_curr_context($conn, $student);
    $response += array(
        'student_group' => $student->group,
        'first_name' => $student->firstName,
        'last_name' => $student->lastName,
        'gender' => $student->gender,
        'birthday' => $student->birthday,
        'status' => $student->status,
        'id' => $student->id,
    );
    $jsonResponse = json_encode($response);
    echo $jsonResponse;
}

server_connect_response();
?>