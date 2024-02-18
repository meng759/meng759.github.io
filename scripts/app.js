"use strict";


(function(){

    function Checklogin(){

        if(sessionStorage.getItem("user")){
            $("#login").html(`<a id="logout" class="nav-link" href="#"><i class="fas fa-sign-out-alt"></i>Logout</a>`)
        }

        $("#logout").on("click", function(){

            sessionStorage.clear();
            location.href = "login.html";
        });
    }

    function LoadHeader(html_data){
        $("header").html(html_data);
        $(`li>a:contains(${document.title})`).addClass("active").attr("aria-current", "page");
        Checklogin();
    }

    function AjaxRequest(method, url, callback){

        // step 1: Instantiate an XHR object
        let xhr = new XMLHttpRequest();

        // step 2: Open a connection to the server
        xhr.open(method, url);

        //Step3: Add event listener for readystatechange event
        // the ready state event is being triggered when the stat of the document being fetched changes
        xhr.addEventListener("readystatechange", () =>{

            if(xhr.readyState === 4 && xhr.status === 200){

                //response succeeded - data is available in here only
                if(typeof callback == "function"){
                    callback(xhr.responseText);
                }else{
                    console.error("ERROR: callback not a function");
                }
            }

        });

        //Step4: send the request
        xhr.send();
    }

    function ContactFormValidation(){
        ValidateField("#fullName", /^([A-Z][a-z]{1,3}\.?\s)?([A-Z][a-z]+)+([\s,-]([A-z][a-z]+))*$/, "Please enter valid First and Last name");
        ValidateField("#contactNumber", /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]\d{4}$/, "Please enter valid Contact Number");
        ValidateField("#emailAddress", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/, "Please enter valid EmailAddress");
    }


    /**
     * This function validate the input for text fields
     * @param input_field_id
     * @param regular_expression
     * @param error_message
     * @constructor
     */
    function ValidateField(input_field_id, regular_expression, error_message){

        let messageArea = $("#messageArea");

        //let fullNamePattern = /^([A-Z][a-z]{1,3}\.?\s)?([A-Z][a-z]+)+([\s,-]([A-z][a-z]+))*$/;

        $(input_field_id).on("blur", function(){
            // fail validation
            let inputFieldText = $(this).val();
            if(!regular_expression.test(inputFieldText)){
                //pattern fails
                $(this).trigger("focus").trigger("select");
                messageArea.addClass("alert alert-danger").text(error_message).show();
            }else{
                //pass validation
                messageArea.removeAttr("class").hide();
            }
        });
    }

    function AddContact(fullName, contactNumber, emailAddress){
        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if(contact.serialize()){
            let key = contact.fullName.substring(0,1)+Date.now();
            localStorage.setItem(key,contact.serialize());
        }
    }

    function DisplayHomePage(){
        console.log("Called DisplayHomePage()");

        $("#AboutUsBtn").on("click",() =>{
            location.href = "about.html";
        })

        $("main").append(`<p id="MainParagraph" class="mt-3">This is my first paragraph</p>`);
        $("body").append(`<article class="container">
                                <p id="ArticleParagraph" class="mt-3">This is my article paragraph</p></article>`);

        // let AboutUsButton = document.getElementById("AboutUsBtn")
        //
        // AboutUsButton.addEventListener("click",function(){
        //     location.href = "about.html";
        // });

        // let MainContent = document.getElementsByTagName("main")[0];
        // let MainParagraph = document.createElement("p");
        //
        // MainParagraph.setAttribute("id", "MainParagraph");
        // MainParagraph.setAttribute("class", "mt-3");
        //
        // MainParagraph.textContent = "This is my first paragraph";
        // MainContent.appendChild(MainParagraph);

        // let FirstString = "This is";
        // let SecondString = `${FirstString} the main paragraph`;
        // MainParagraph.textContent = SecondString;
        // MainContent.appendChild(MainParagraph);
        //
        // let DocumentBody = document.body;
        // let Article = document.createElement("article");
        // let ArticleParagraph = `<p id=ArticleParagraph" class="mt-5">This is my article paragraph</p:>`;
        // Article.setAttribute("class","container");
        // Article.innerHTML = ArticleParagraph;
        // DocumentBody.appendChild(Article);
    }

    function DisplayProductPage(){
        console.log("Called DisplayProductPage()");

    }

    function DisplayAboutUsPage(){
        console.log("Called DisplayAboutUsPage()");

    }

    function DisplayContactUsPage() {
        console.log("Called DisplayContactUsPage()");

        ContactFormValidation();

        let submitButton = document.getElementById("submitButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckbox");


        submitButton.addEventListener("click", function (){
            if(subscribeCheckbox.checked) {
                //console.log("HERE");
                AddContact(fullName.value, contactNumber.value, emailAddress.value);
            }
        });
    }

    function DisplayServicesPage(){
        console.log("Called DisplayServicesPage()");

    }


    function DisplayContactListPage(){
        console.log("Called DisplayContactListPage()");

        if(localStorage.length > 0){
            let contactList = document.getElementById("contactList");
            let data="";

            let keys = Object.keys(localStorage);
            let index = 1;

            for(const key of keys){
                let contactData = localStorage.getItem(key);
                let contact = new core.Contact();
                contact.deserialize(contactData);
                data += `<tr><th scope="row" class="text-center">${index}</th>
                        <td>${contact.fullName}</td>
                        <td>${contact.contactNumber}</td>
                        <td>${contact.emailAddress}</td>
                        <td class="text-center">
                            <button value="${key}" class="btn btn-primary btn-sm edit">
                                <i class="fas fa-edit fa-sm">Edit</i>   
                            </button>
                        </td>
                        <td>
                            <button value="${key}" class="btn btn-danger btn-sm delete">
                                <i class="fas fa-trash-alt fa-sm">Delete</i>   
                            </button>
                        </td>
                        </tr>`;
                index++;
            }
            contactList.innerHTML = data;
        }

        $("#addButton").on("click",() =>{
            location.href = "edit.html#add";
        });

        $("button.edit").on("click", function (){
            location.href = "edit.html#" + $(this).val();
        });

        $("button.delete").on("click", function(){

            if(confirm("Delete Contact, Please confirm")){
                localStorage.removeItem($(this).val());
            }
            location.href="contact-list.html";

        });

    }

    function DisplayEditPage(){

        console.log("DisplayEdit Page Called...");

        ContactFormValidation();

        let page = location.hash.substring(1);

        switch(page){
            case "add":
                // add contact chosen
                $("main>h1").text("Add Contact");
                $("#editButton").html(`<i class="fas fa-plus-circle fa-sm"/> Add`);

                $("#editButton").on("click",(event) => {

                    //prevent form submission
                    event.preventDefault();
                    AddContact(fullName.value, contactNumber.value, emailAddress.value);
                    location.href = "contact-list.html";

                });

                $("#cancelButton").on("click",() =>{
                    location.href = "contact-list.html";
                });


                break;
            default:
                //edit contact chosen

                let contact = new core.Contact();
                contact.deserialize(localStorage.getItem(page));

                //pre-populate form
                $("#fullName").val(contact.fullName);
                $("#contactNumber").val(contact.contactNumber);
                $("#emailAddress").val(contact.emailAddress);

                $("#editButton").on("click",(event)=>{
                    console.log("HI");
                    //prevent from submission
                    event.preventDefault();
                    contact.fullName = $("#fullName").val();
                    contact.contactNumber = $("#contactNumber").val();
                    contact.emailAddress = $("#emailAddress").val();

                    localStorage.setItem(page, contact.serialize());
                    location.href = "contact-list.html";
                });

                $("#cancelButton").on("click", () => {
                    location.href = "contact-list.html";
                })
                break;
        }
    }


    function DisplayLoginPage(){
        console.log("Called DisplayLoginPage()");

        let messageArea = $("#messageArea");
        messageArea.hide();

        $("#loginButton").on("click", function(){

            let success = false;
            let newUser = new core.User();

            $.get("./data/users.json",function(data){

                for(const user of data.users){

                    console.log(user);
                    if(username.value === user.Username && password.value === user.Password){

                        success = true;
                        newUser.fromJSON(user);
                        break;
                    }
                }


                if(success){

                    sessionStorage.setItem("user", newUser.serialize());
                    messageArea.remove("class").hide();
                    location.href = "contact-list.html";
                }else{
                    $("#username").trigger("focus").trigger("select");
                    messageArea
                        .addClass("alert alert-danger")
                        .text("Error: Invalid Login Credentials")
                        .show();

                }
            });

        });

        $("#cancelButton").on("click", function(){

            document.forms[0].reset();
            location.href = "index.html";

        });



    }


    function DisplayRegisterPage(){
        console.log("Called DisplayRegisterPage()");

    }

    function Start(){
        console.log("App Started");

        AjaxRequest("GET", "header.html", LoadHeader);

        switch(document.title){
            case "Home":
                DisplayHomePage();
                break;
            case "Our Products":
                DisplayProductPage();
                break;
            case "About Us":
                DisplayAboutUsPage();
                break;
            case "Our Services":
                DisplayServicesPage();
                break;
            case "Contact Us":
                DisplayContactUsPage();
                break;
            case "Contact List":
                DisplayContactListPage();
                break;
            case "Edit Contact":
                DisplayEditPage();
                break;
            case "Login":
                DisplayLoginPage();
                break;
            case "Register":
                DisplayRegisterPage();
                break;
        }
    }
    window.addEventListener("load", Start);
})()
