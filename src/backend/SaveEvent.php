<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Configuración de conexión
$servername = "localhost:3306";
$username = ""; 
$password = ""; 
$database = "ganaturifa";

// Conexión
$conn = new mysqli($servername, $username, $password, $database);

// Manejo de error de conexión
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Error al conectar con la base de datos: " . $conn->connect_error]);
    exit; // Detener ejecución si hay error de conexión
}

// Decodificar datos del JSON recibido
$data = json_decode(file_get_contents("php://input"), true);
$titulo = $data['titulo'];
$nombrePropiedad = $data['nombrePropiedad'];
$habitaciones = $data['habitaciones'];
$baños = $data['baños'];
$puestoAuto = $data['puestoAuto'];
$tamaño = $data['tamaño'];
$descripcion = $data['descripcion'];
$duracion = $data['duracion'];
$img = $data['img'];

// Procesar imágenes
if (isset($_FILES['img'])) {
    foreach ($_FILES['img']['tmp_name'] as $key => $tmp_name) {
        $image_name = $_FILES['img']['name'][$key];
        $image_tmp_name = $_FILES['img']['tmp_name'][$key];
        $upload_dir = 'uploads/'; // Directorio donde se guardarán las imágenes
        $image_path = $upload_dir . basename($image_name);
        
        if (move_uploaded_file($image_tmp_name, $image_path)) {
            echo json_encode(["status" => "success", "message" => "Image uploaded successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to upload image"]);
        }
    }
}

// Validar que no haya datos vacíos
if (!$titulo || !$nombrePropiedad || !$habitaciones || !$baños || !$puestoAuto || !$tamaño || !$descripcion || !$duracion || !$img) {
    echo json_encode(["status" => "error", "message" => "Faltan datos obligatorios"]);
    exit;
}

// Preparar y ejecutar consulta
$sql = "INSERT INTO eventos (titulo, nombrePropiedad, habitaciones, baños, puestoAuto, tamaño, descripcion, duracion, img) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssiiiisss", $titulo, $nombrePropiedad, $habitaciones, $baños, $puestoAuto, $tamaño, $descripcion, $duracion, $img);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Evento guardado correctamente"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al guardar el evento: " . $stmt->error]);
}

// Cerrar conexión
$stmt->close();
$conn->close();
?>
