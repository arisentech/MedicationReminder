<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: *");

error_reporting(0);
ini_set('display_errors', 0);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = "localhost";
$db_name = "u657474163_medication_app";
$username = "u657474163_medication_app"; 
$password = "#Shiva@3680m"; 

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $exception) {
    echo json_encode(["success" => false, "error" => "DB connection failed."]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"));
$action = isset($_GET['action']) ? $_GET['action'] : '';

try {
    if ($method === 'POST' && $action === 'register') {
        $stmt = $conn->prepare("INSERT INTO users (name, email) VALUES (:name, :email)");
        $stmt->execute([':name' => $data->name, ':email' => $data->email]);
        echo json_encode(["success" => true, "user_id" => $conn->lastInsertId(), "name" => $data->name]);
        exit();
    }

    if ($method === 'POST' && $action === 'login') {
        $stmt = $conn->prepare("SELECT id, name FROM users WHERE email = :email");
        $stmt->execute([':email' => $data->email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($user) {
            echo json_encode(["success" => true, "user_id" => $user['id'], "name" => $user['name']]);
        } else {
            echo json_encode(["success" => false, "error" => "Email not found."]);
        }
        exit();
    }

    if ($method === 'POST' && $action === 'save_medication') {
        $stmt = $conn->prepare("INSERT INTO medications (user_id, name, dosage, frequency, times) VALUES (:user_id, :name, :dosage, :frequency, :times)");
        $stmt->execute([
            ':user_id' => $data->user_id, ':name' => $data->name, ':dosage' => $data->dosage,
            ':frequency' => $data->frequency, ':times' => json_encode($data->times)
        ]);
        echo json_encode(["success" => true, "med_id" => $conn->lastInsertId()]);
        exit();
    }

    if ($method === 'POST' && $action === 'delete_medication') {
        $stmt = $conn->prepare("DELETE FROM medications WHERE id = :id");
        $stmt->execute([':id' => $data->id]);
        echo json_encode(["success" => true]);
        exit();
    }

    if ($method === 'GET' && $action === 'get_medications') {
        $stmt = $conn->prepare("SELECT * FROM medications WHERE user_id = :user_id");
        $stmt->execute([':user_id' => $_GET['user_id']]);
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($res ? $res : []);
        exit();
    }

    // ACCURATELY LOGS TAKEN VS MISSED
    if ($method === 'POST' && $action === 'log_medication') {
        $stmt = $conn->prepare("INSERT INTO medication_logs (medication_id, status) VALUES (:med_id, :status)");
        $stmt->execute([':med_id' => $data->med_id, ':status' => $data->status]);
        echo json_encode(["success" => true]);
        exit();
    }

    // ACCURATELY PULLS HISTORY BASED ON STATUS[cite: 9]
    if ($method === 'GET' && $action === 'get_history') {
        $date = isset($_GET['date']) ? $_GET['date'] : date('Y-m-d');
        $stmt = $conn->prepare("
            SELECT m.name, m.dosage, l.status, l.logged_at 
            FROM medication_logs l 
            JOIN medications m ON l.medication_id = m.id 
            WHERE m.user_id = :user_id AND DATE(l.logged_at) = :log_date
            ORDER BY l.logged_at DESC
        ");
        $stmt->execute([':user_id' => $_GET['user_id'], ':log_date' => $date]);
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($res ? $res : []);
        exit();
    }

    if ($method === 'GET' && $action === 'get_caregivers') {
        $stmt = $conn->prepare("SELECT * FROM caregivers WHERE user_id = :user_id");
        $stmt->execute([':user_id' => $_GET['user_id']]);
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($res ? $res : []);
        exit();
    }

    // MATCHES YOUR DATABASE EXACTLY[cite: 9]
    if ($method === 'POST' && $action === 'save_caregiver') {
        $stmt = $conn->prepare("INSERT INTO caregivers (user_id, name, email, notify_on_missed) VALUES (:user_id, :name, :email, :notify)");
        $notify = (isset($data->notifyOnMissed) && $data->notifyOnMissed) ? 1 : 0;
        $stmt->execute([
            ':user_id' => $data->user_id, 
            ':name' => $data->name, 
            ':email' => $data->email, 
            ':notify' => $notify
        ]);
        echo json_encode(["success" => true]);
        exit();
    }

    if ($method === 'POST' && $action === 'delete_caregiver') {
        $stmt = $conn->prepare("DELETE FROM caregivers WHERE id = :id");
        $stmt->execute([':id' => $data->id]);
        echo json_encode(["success" => true]);
        exit();
    }

} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
    exit();
}
?>