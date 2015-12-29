<?php
$raw_data = $_POST['data'];
$nomefile = $_POST['filename'];
$uploaddir="images/";
$url="images/";

$data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $raw_data));

  file_put_contents(
    $uploaddir.$nomefile,$data
  );

$response = array('percorso' => $url.$nomefile);
echo json_encode($response);
?>
