<?

$json = $_REQUEST["json"];

$fh = $fopen("test.json","w");

fwrite($fh, $json);

fclose($fh);

?>