<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: POST');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization,X-Requested-With');

  include_once '../../config/Database.php';
  include_once '../../models/Player.php';
  // Instantiate DB & connect
  $database = new Database();
  $db = $database->connect();

  // Instantiate blog post object
  $player = new Player($db);

  // Get raw posted data
  $data = json_decode(file_get_contents("php://input"));

// need to check the data is valid or not
if(!(is_null($data->name) && is_null($data->score))) {

  $player->name = $data->name;
  $player->score = $data->score;

  // Create Player

  // if($player->create() == "success") {
  //   echo json_encode(
  //     array('message' => 'player Created')
  //   );
  // } elseif ($player->create() ) {
  //   echo json_encode(
  //     array('message' => 'player Not Created')
  //   );
  // }

  switch ($player->create()) {
    case "success":
        echo json_encode(
        array('message' => 'Your name has been carved!')
      );
    break;
    case "duplicate":
      //   echo json_encode(
      //   array('message' => 'Duplicate Name Type Different And Unique Name')
      // );
        switch ($player->update()) {
          case "success":
            echo json_encode(array('message' => 'Your name and score has been carved'));
          break;
          default:
            echo json_encode(
              array('message' => 'score update failed')
            );
        }
    break;
    default:
      echo json_encode(
        array('message' => 'Sorry could not carve your name')
      );
  }

} else {
    echo json_encode(
      array('message' => 'Sorry could not carve your name')
    );
}


