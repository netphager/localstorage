<?php
header('Content-type: application/json');

$custId = 'null';
$channel = 'I';
if(!empty($_GET['channel'])) {
    $channel = $_GET['channel'];
}

if(isset($_GET['playMode']) && $_GET['playMode']=='realplay') {
    if(!empty($_GET['custId'])) {
        $custId = $_GET['custId'];
    }
    $freePlay = 'realplay';
} else {
    $freePlay = 'freeplay';
}
$name = 'CayRouletteEuropean';

if(!empty($_GET['gameId'])) {
    $name = $_GET['gameId'];
}
function random_numbers($digits) {
    $min = pow(10, $digits - 1);
    $max = pow(10, $digits) - 1;
    return mt_rand($min, $max);
}
?>
{
    "config": {
        "base": {
            "playMode": "<?php echo $freePlay; ?>"
        },
        
        "topbar": {
            "helpURL": "http://www.cayetano.bg/help",
            "homeURL": "http://www.cayetano.bg/home"
        },
        
        "server": {
            "rgsConfigURL": "http://games.cayetano.bg/server/rgsconfig.php?timer=<?php echo random_numbers(4);?>",
            "serverURL": "http://ext-gp-stable.cayetano.bg/games-platform/service/",
            "gameId":    "<?php echo $name; ?>",
            "channel": "<?php echo $channel; ?>",
            "custId": "<?php echo $custId; ?>",
            "affId": ""
        },
        
        "game": {
            "gameTitle": "Roulette EU"
        },
        
        "dynamicParameters": {
            "fogURL": "pproxy/Servlet"
        }
    }
}