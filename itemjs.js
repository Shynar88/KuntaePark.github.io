var config = {
  apiKey: "AIzaSyC-hLbY7tuadTg8l6nRQ7YsfWbAFmnFQS0",
  databaseURL: "https://prototype-a5084.firebaseio.com/",
};
firebase.initializeApp(config);
var database = firebase.database();
var itemsRef = database.ref('items');
var selectionsRef = database.ref('selections');
var srchsRef = database.ref('srchs');
var table = document.getElementById("table")
var name = ""
var lst = []

var commentsRef = database.ref('comments');
var itemCommentsRef = null;
var itemKey;

var curUserName = "John"
var curUserCntry = "Indonesia"
var curDate //temporary measure



$( document ).ready(function() {
	getname()
	fillpage()
  generatelst()
  $('#srch').autocomplete({
    minCharacters : 2,
    source: lst,
    select: function (e, ui) {
      var obj = {
        ans : ui.item.label
      }
      selectionsRef.push(obj)
      location.href = "item.html";
      return false
  }
  })
  
})

document.getElementById("srch").addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      var obj = {
        ans : document.getElementById("srch").value
      }
      srchsRef.push(obj)
      location.href = "webs.html";
  }})


function getname() {
	selectionsRef.once("value", function(selections) {
	            selections.forEach(function(selection){
	              name = selection.val().ans
                selectionsRef.remove()
                itemsRef.orderByChild("engname").equalTo(name).once('value',function(snapshot) {
                  itemKey = Object.keys(snapshot.val())[0]
                  itemCommentsRef = commentsRef.child(itemKey)
                  itemCommentsRef.on('value', function (snapshot) {
                    var commentsObject = snapshot.val()
                    renderComments(commentsObject)
                  })
               })
	            });
	          });
}

function fillpage() {
	itemsRef.once("value", function(items) {
            items.forEach(function(item){
              if (name == item.val().engname) {
              	var ingrs = item.val().ingredients
              	document.getElementById("imgid").src=item.val().pic
              	document.getElementById("engname").innerText = item.val().engname
              	document.getElementById("korname").innerText = item.val().korname
              	for (var ingrnum in ingrs) { 
                  if (ingrs[ingrnum].state != "0"){
                		var row = table.insertRow(1);
          					var cell1 = row.insertCell(0);
          					var cell2 = row.insertCell(1);
          					cell1.innerHTML = ingrs[ingrnum].engingr
          					cell2.innerHTML = ingrs[ingrnum].koringr
                  }
              	}
                for (var ingrnum in ingrs) { 
                  if (ingrs[ingrnum].state == "0"){
                  var row = table.insertRow(1);
                  var cell1 = row.insertCell(0);
                  var cell2 = row.insertCell(1);
                  cell1.innerHTML = ingrs[ingrnum].engingr
                  cell2.innerHTML = ingrs[ingrnum].koringr
                  row.style.color = "#ff5233"
                  } 
                }
              	if (item.val().status == "Haram") {
              		document.getElementById("circle").style.backgroundColor = "#ff5233"
              		document.getElementById("circle").innerText = "Haram"
              	} else if (item.val().status == "Suspicious") {
                  document.getElementById("circle").style.backgroundColor = "rgba(255,224,51,0.85)"
                  document.getElementById("circle").innerText = "Suspicious"
                } else {
                  document.getElementById("circle").style.backgroundColor = "#99cd32"
                  document.getElementById("circle").innerText = "Halal"
                }
              }
            })
          });
}

function generatelst() {
  itemsRef.once("value", function(items) {
            items.forEach(function(item){
              lst.push(item.val().engname)
            });
          });
}

// Firebase Database setup
// Initialize Firebase

// Bind comments to firebase


function addMessage(usrname, cntry, date, message) {
  var messageObject = {
    usrname: usrname,
    cntry: cntry,
    date: date,
    message: message,
  }
  itemCommentsRef.push(messageObject)
}

function renderComments(comments) {
  var htmls;
  if(comments == null) {
    htmls = null;
  } else {
    htmls = Object.values(comments).map(function (comment) {
      return `
      <div class="comment">
        <a class="avatar">
          <img src="https://semantic-ui.com/images/avatar/small/joe.jpg">
        </a>
        <div class="content">
          <a class="author">${comment.usrname}</a>
          <div class="metadata">
            <div>${comment.cntry}</div>
            <div class="date">${comment.date}</div>
          </div>
          <div class="text">
            ${comment.message}
          </div>
        </div>
      </div>

    `
    })
  }
  $('#commentWrap').html(htmls)
}

$('#commentbtn').on("click",function (e) {
  e.preventDefault()
  var message = $('.field textarea').val()

  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  if(dd<10) {
      dd = '0'+dd
  } 

  if(mm<10) {
      mm = '0'+mm
  } 

  today = mm + '/' + dd + '/' + yyyy;
  curDate = today
  addMessage(curUserName,curUserCntry,curDate,message)
  return false
})

$('#message').on("click",function() {
  if(curUserName == null) {
    //connect to log in functionality
  }
}); 