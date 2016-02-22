<?php

require_once 'connection.php';
require_once 'models/allstar-model.php';
require_once 'models/wins-model.php';

$start = 2000;
$end = 2010;

if (isset($_GET['type'])) {
    $type = $_GET['type'];
}
else {
    $type = '';
}

$conn = getConnection();

if (strcmp($type, "allstar") == 0) {
    $allstarModel = new Allstar($conn);
    $allstarMatches = $allstarModel->search($start, $end);
    echo json_encode($allstarMatches);
} else if (strcmp($type, "wins") == 0) {
    $winsModel = new Wins($conn);
    $winsMatches = $winsModel->search($start, $end);
    echo json_encode($winsMatches);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><?=htmlentities($matches[0]['title'])?></title>
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta charset="UTF-8">
    
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="css/index.css" />
</head>
<body class="container">
    <p>hello!</p>
</body>
</html>