/**
 * Created by azhelev on 24.8.2015 ?..
 */
var number = localStorage.getItem('number') ? parseInt(localStorage.getItem('number')) : 1;

document.getElementById('inc').addEventListener('click', function () {
	number++;
	localStorage.setItem('number',number);
	document.getElementById('number').innerHTML = number;
});
