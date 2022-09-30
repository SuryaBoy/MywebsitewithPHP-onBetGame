<?php 

  class Player {
    // DB stuff
    private $conn;
    private $table = 'players';

    // player Properties
    public $id;
    public $name;
    public $time;
    public $score;

    // Constructor with DB
    public function __construct($db) {
      $this->conn = $db;
    }

    // Get Posts
    public function read() {
      // Create query for 10 highest scores
      $query = 'SELECT name, time, score FROM ' . $this->table . ' ORDER BY score DESC LIMIT 10';
      
      // Prepare statement
      $stmt = $this->conn->prepare($query);

      // Execute query
      $stmt->execute();

      return $stmt;
    }

	// Create Category
	public function create() {
	// Create Query
	$query = 'INSERT INTO ' .
	  $this->table . '
	SET
	  name = :name, score = :score';

	// Prepare Statement
	$stmt = $this->conn->prepare($query);

	// Clean data
	$this->name = htmlspecialchars(strip_tags($this->name));
	$this->score = htmlspecialchars(strip_tags($this->score));

	// Bind data
	$stmt-> bindParam(':name', $this->name);
	$stmt-> bindParam(':score', $this->score);

// Try to execute the query
    try {
    	$stmt->execute();
    	return "success";
	    }
	    catch (PDOException $e) {
	    	// exclusively checking for duplicate entry;
	    	if($stmt->errorCode() == 23000) {
	    		// $this->update();
	    		return "duplicate";
	    		// return $this->update();
	    	} else {
	    		return "error" ;
	    	}
	    }
	// Execute query
	// if($stmt->execute()) {
	// 	return true;
	// } else {
	// 	// Print error if something goes wrong
	// 	printf("Error: $s.\n", $stmt->error);

	// 	return false;
	// 	}
	}

	public function update() {
          // Create query
          $query = 'UPDATE ' . $this->table . ' SET score = :score, time = :time WHERE name = :name';

          // Prepare statement
          $stmt = $this->conn->prepare($query);

          // Clean data
			$this->name = htmlspecialchars(strip_tags($this->name));
			$this->score = htmlspecialchars(strip_tags($this->score));
			$this->time = date("Y-m-d H:i:s", time());

          // Bind data
			$stmt-> bindParam(':name', $this->name);
			$stmt-> bindParam(':score', $this->score);
			$stmt-> bindParam(':time', $this->time);

          // Execute query
          // if($stmt->execute()) {
          //   return true;
          // }

          // // Print error if something goes wrong
          // printf("Error: %s.\n", $stmt->error);

          // return false;

			try {
				$stmt->execute();
				return "success";
			}
		    catch (PDOException $e) {
		    	// printf("Error: %s.\n", $stmt->error);
		    	print_r($stmt->errorInfo());
		    	return "error" ;
		    }
	}
}