<?php
$_ENV = array();

for ($i = 1; $i < count($argv); $i++) {
    $parts = explode("=", $argv[$i]);
    $parts[1] = str_replace("%20", " ", $parts[1]);
    $_ENV[$parts[0]] = $parts[1];
}
?>