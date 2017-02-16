<?php

$root = $_SERVER['DOCUMENT_ROOT'] . "/";
$appFolder = 'fileupload/';
$uploadsFolder = 'uploads/';
$filename = $_SERVER['HTTP_FILENAME'];

$destination = $root . $appFolder . $uploadsFolder . $filename;

// This is how we grab the file's contents:
$source = file_get_contents("php://input");

//This is how we save the contents as a local file:
file_put_contents($destination, $source);

exit("File uploaded: " . $filename);

?>