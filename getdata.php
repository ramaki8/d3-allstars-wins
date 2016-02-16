<?php

require_once 'connection.php';
require_once 'models/allstar-model.php';
require_once 'models/wins-model.php';

$year = 2010;

if (isset($_GET['type'])) {
    $type = $_GET['type'];
}
else {
    $type = '';
}

$conn = getConnection();

if (strcmp($type, "allstar") == 0) {
    $allstarModel = new Allstar($conn);
    $allstarMatches = $allstarModel->search($year);
    echo json_encode($allstarMatches);
} else if (strcmp($type, "wins") == 0) {
    $winsModel = new Wins($conn);
    $winsMatches = $winsModel->search($year);
    echo json_encode($winsMatches);
}
?>