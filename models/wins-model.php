<?php
class Wins {
    protected $conn;
    
    public function __construct($conn) {
        $this->conn = $conn;
    }
    
    public function search($year) {
        $sql = 'select name, teamID, W, L from Teams
                    WHERE yearID = ?
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