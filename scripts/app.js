/**
 * Created by azhelev on 24.8.2015 ?..
 */
var addListButton = document.getElementById('openAdd');
var content       = document.getElementById('content');
var list = null;
/* events*/
addListButton.addEventListener('click', function () {
	list = new List();
	list.add();
});

var showLists = function () {
	var lists = localStorage.getItem('lists') ? JSON.parse(localStorage.getItem('lists')) : {};
	var listsHtml = '';
	for(var name in lists) {
		listsHtml += '<h1>'+name+' - <button id="remove" name="'+name+'">DELETE</button></h1>';
		for(var j =0; j < lists[name].length; j++) {
			listsHtml += '<p>name:'+lists[name][j].name+' - price:'+lists[name][j].price+' - number: '+lists[name][j].number+'</p>';
		}
	}

	content.innerHTML = listsHtml;
};
showLists();
var removeList = function (name) {
	var lists = localStorage.getItem('lists') ? JSON.parse(localStorage.getItem('lists')) : {};
	delete lists[name];
	localStorage.setItem('lists',JSON.stringify(lists));
};
document.addEventListener('click', function (event) {
	switch(event.target.id) {
		case 'save':
			list.save();
			showLists();
			break;
		case 'addProduct':
			list.addProduct();
			break;
		case 'edit':
			list.edit();
			break;
		case 'remove':
			removeList(event.target.name);
			showLists();
			break;
	}
});
