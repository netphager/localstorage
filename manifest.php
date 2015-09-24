<?php

header("Content-type: application/csv");
header("Content-Disposition: attachment; filename=cache.appcache");
header("Pragma: no-cache");
header("Expires: 0");


$paths = array('img/*', 'css/*', '*.js', 'fonts/*');

$fileCont = 'CACHE MANIFEST
# '.date('Y-m-d').'

CACHE:
';

foreach($paths as $path) {
	$arr = glob($path);
	foreach($arr as $file) {
		if(is_dir($file.'/')) {
			$arr2 = glob($file.'/*');
			foreach($arr2 as $file2) {
				$fileCont .= $file2.'
';	
			}
		} else {
		$fileCont .= $file.'
';	
		}
	}
}
 

$fileCont .= '
NETWORK:
*
';


echo $fileCont;

?>