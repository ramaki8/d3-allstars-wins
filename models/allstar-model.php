<?php
class Allstar {
    protected $conn;
    
    public function __construct($conn) {
        $this->conn = $conn;
    }
    
    public function search($start, $end) {
        $sql = 'select teamID, yearID, count(playerID) AS playerCount from AllstarFull
                    WHERE yearID BETWEEN ? AND ?
                    group by teamID, yearID
                    order by teamID, yearID;';
        $stmt = $this->conn->prepare($sql);
        $success = $stmt->execute(array($start, $end));
        if (!$success) {
            var_dump($stmt->errorInfo());
            return false;
        } else {
            return $stmt->fetchAll();
        }
    }
}
?>