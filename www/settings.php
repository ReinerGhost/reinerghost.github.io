<?php
/**
 * Для тестирования получения настроек
 * @return mixed|void
 */
function getSettings()
{
    // Prepare new cURL resource
    $crl = curl_init($_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['HTTP_HOST'] . '/mobile-get-settings');
    curl_setopt($crl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($crl, CURLOPT_VERBOSE, true);
    curl_setopt($crl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($crl, CURLOPT_VERBOSE, true);
    curl_setopt($crl, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($crl, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($crl, CURLOPT_POST, true);
    curl_setopt($crl, CURLOPT_POSTFIELDS, []);

    // Submit the POST request
    $result = curl_exec($crl);
    if (!$result) {
        die('Error: "' . curl_error($crl) . '" - Code: ' . curl_errno($crl));
    }
    curl_close($crl);
    $settings = (json_decode($result));

    return $settings;
}

$settings = getSettings();

var_dump($settings);
