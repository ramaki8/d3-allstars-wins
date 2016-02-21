<?php
class Wins {
    protected $conn;
    
    public function __construct($conn) {
        $this->conn = $conn;
    }
    
    public function search($start, $end) {
        $sql = 'select name, teamID, W, L, yearID from Teams
                    WHERE yearID BETWEEN ? AND ?
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