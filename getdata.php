<?php

require_once 'connection.php';
require_once 'models/allstar-model.php';
require_once 'models/wins-model.php';
if (isset($_GET['q'])) {
    $q = $_GET['q'];   
}
else {
    $q = '';
}

if (isset($_GET['type'])) {
    $type = $_GET['type'];
}
else {
    $type = '';
}

$conn = getConnection();

if (strcmp($type, "allstar") == 0) {
    $allstarModel = new Allstar($conn);
    $allstarMatches = $allstarModel->search(2010);
    echo json_encode($allstarMatches);
} else if (strcmp($type, "wins") == 0) {
    $winsModel = new Wins($conn);
    $winsMatches = $winsModel->search(2010);
    echo json_encode($winsMatches);
}
?>