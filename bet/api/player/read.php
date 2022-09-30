<?php 
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');

  include_once '../../config/Database.php';
  include_once '../../models/Player.php';

  // Instantiate DB & connect
  $database = new Database();
  $db = $database->connect();

  // Instantiate player object
  $player = new player($db);

  // Category read query
  $result = $player->read();
  
  // Get row count
  $num = $result->rowCount();

  // Check if any players
  if($num > 0) {
        // player array
        $player_arr = array();
        $player_arr['data'] = array();

        while($row = $result->fetch(PDO::FETCH_ASSOC)) {
          extract($row);

          $player_item = array(
            'name' => $name,
            'time' => $time,
            'score' => $score
          );

          // Push to "data"
          array_push($player_arr['data'], $player_item);
        }

        // Turn to JSON & output
        echo json_encode($player_arr);

  } else {
        // No Categories
        echo json_encode(
          array('message' => 'No players Found')
        );
  }
