/**
 * Created by azhelev on 24.8.2015 ?..
 */
var List = function () {
	var that = this;
	this.products = [];

	this.renderTemplate = function (template,contentDiv,callback,append) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'templates/'+template+'.html', true);
		xhr.onreadystatechange = function() {
			if (this.readyState!==4) return;
			if (this.status!==200) return; // or whatever error handling you want
			contentDiv = document.getElementById(contentDiv);
			if(append) {
				var div = document.createElement('div');
				div.innerHTML = this.responseText;
				contentDiv.appendChild(div);
				if(callback) callback();
				return;
			}
			contentDiv.innerHTML= this.responseText;
		};
		xhr.send();
	};

	this.add = function () {
		this.renderTemplate('addList','content');
	};

	this.addProduct = function() {
		this.renderTemplate('product','products', function () {
			var products = document.getElementsByClassName('product');
			var lastProduct = products[products.length - 1];
			that.products.push(lastProduct);
			/*inc*/
			lastProduct.children[3].addEventListener('click', function () {
				lastProduct.children[2].value = parseFloat(lastProduct.children[2].value) + 1;
			});
			/*dec*/
			lastProduct.children[4].addEventListener('click', function () {
				lastProduct.children[2].value = parseFloat(lastProduct.children[2].value) - 1;
			});
		},true);
	};

	this.save = function () {
		var lists = localStorage.getItem('lists') ? JSON.parse(localStorage.getItem('lists')) : {};
		var listName = document.getElementById('listName').value;
		var list = [];
		for(var i=0;i < that.products.length;i++) {
			var product = {};
			for(var j = 0;j < that.products[i].children.length;j++) {
				product[that.products[i].children[j].name] = that.products[i].children[j].value;
			}
			list.push(product);
		}
		lists[listName] = list;
		localStorage.setItem('lists',JSON.stringify(lists));
	};

	this.edit = function () {

	};




};

