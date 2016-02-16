<?php
class Allstar {
    protected $conn;
    
    public function __construct($conn) {
        $this->conn = $conn;
    }
    
    public function search($year) {
        $sql = 'select teamID, count(playerID) AS playerCount from AllstarFull
                    where yearID = ?
                    group by teamID
                    order by teamID;';
        $stmt = $this->conn->prepare($sql);
        $success = $stmt->execute(array($year));
        if (!$success) {
            var_dump($stmt->errorInfo());
            return false;
        } else {
            return $stmt->fetchAll();
        }
    }
}
?>