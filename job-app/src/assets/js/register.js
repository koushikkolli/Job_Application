//validaation variables
var name_val = false;
var email_val = false;
var pass_val = false;
var cpass_val = false;


var firebaseConfig = {
    apiKey: "AIzaSyCn9jWEt920Rjnl03EvBDt35Li32RrfVvM",
    authDomain: "portal-f4e46.firebaseapp.com",
    databaseURL: "https://portal-f4e46.firebaseio.com",
    projectId: "portal-f4e46",
    storageBucket: "portal-f4e46.appspot.com",
    messagingSenderId: "479478503614",
    appId: "1:479478503614:web:2b1f774b29883bcdbfa6ef",
    measurementId: "G-QSPXDJVTCM"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);



$(document).ready(function(){
    
    //name validate
    $('#name').change(function(){
        var val = document.getElementById('name').value;

        if (!/^([a-zA-Z]+\w*){5,20}$/g.test(val)){
            document.getElementById("err-name").className="text-danger";
            $('#err-name').text("name should be 5 to 20 charecteres and only letters are allowed").show().fadeOut(4000);
            name_val = false;
        }
        else{
            document.getElementById("err-name").className="text-success";
            $('#err-name').text("valid").show().fadeOut(4000);
            name_val = true;
        }
        
    });

    //email validation
    $('#email').change(function(){
        var val = document.getElementById('email').value;

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val)){
            document.getElementById("err-mail").className="text-danger";
            $('#err-mail').text("enter a valid mail").show().fadeOut(4000);
            email_val = false;
        }
        else{
            document.getElementById("err-mail").className="text-success";
            $('#err-mail').text("valid").show().fadeOut(4000);
            email_val = true;
        }
    });

    //password validate
    $("#passwd").change(function() {
        var val = document.getElementById('passwd').value;

        if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(val)){
            document.getElementById("err-pass").className="text-danger";
            $('#err-pass').text("password should be 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter").show().fadeOut(4000);
            pass_val = false;
        }
        else{
            document.getElementById("err-pass").className="text-success";
            $('#err-pass').text("valid").show().fadeOut(4000);
            pass_val = true;
        }

    });

    //confirm password
    $("#cpasswd").change(function() {
        var p_val = document.getElementById('passwd').value;
        var c_val = document.getElementById('cpasswd').value;

        if (c_val.localeCompare(p_val) != 0){
            document.getElementById("err-cpass").className = "text-danger";
            $('#err-cpass').text("do not match the password").show().fadeOut(4000);
            cpass_val = false;
        }
        else{
            document.getElementById("err-cpass").className = "text-success";
            $('#err-cpass').text("matches").show().fadeOut(4000);
            cpass_val = true;
        }

    });

});

function register(){

    if (!name_val || !email_val || !pass_val || !cpass_val){
        $('#err-com').text("Please enter valid data").show().fadeOut(2000);
    }
    else{

        var data = {
            name: document.getElementById('name').value,
            mail: document.getElementById('email').value,
            pass: document.getElementById('passwd').value,
            role: document.getElementById('role').value
        };
        alert(JSON.stringify(data));
        
        firebase.auth().createUserWithEmailAndPassword(data['mail'], data['pass']).then(function(result) {
            return result.user.updateProfile({
                displayName: data['name']+"_"+data['role']
            })
        }).then(function() {
            
            //reset the value
            document.getElementById('name').value = "";
            document.getElementById('email').value = "";
            document.getElementById('passwd').value = "";
            document.getElementById('cpasswd').value = "";
            //display message
            document.getElementById("confirm").style.display = "block";
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
            // ...

            document.getElementById("confirm-err").style.display = "block";
          });
    }
}