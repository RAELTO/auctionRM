//LOGIC

var app = new Vue({
    el: '#app',
    data: {
        users: [],
        usession: [],//stores user session profile
        newUser: {
            name: '',
            username: '',
            password: '',
            email: '',
            rmp: 0
        },
        userinput: '',
        passinput: '',
        confirmpass: '',
    },
    methods: {
        addUser(){
            if (
                this.newUser.name.length > 0 && this.newUser.username.length > 0
                && this.newUser.password.length > 0 && this.newUser.email.length > 0
                ) {
                    if (this.confirmpass === this.newUser.password) {
                        this.users.push({
                            ...this.newUser
                        });
                        this.clearFields();
                        this.mensaje("Your account has been successfully created", "success");
                    }else{
                        this.mensaje("Passsword and confirm password doesnt match", "error");
                    }
                
            }else{
                this.mensaje("All the fields are required", "error");
            }
        },
        clearFields(){
            this.newUser = {
                name: '',
                username: '',
                password: '',
                email: '',
                rmp: 0
            }
            this.confirmpass = '';
        },
        login(){
            if (this.userinput.length > 0 && this.passinput.length > 0) {
                const index = this.users.findIndex((object) => {
                    return object.username == this.userinput;
                });
                if(index != -1 && this.passinput === this.users[index].password){
                    this.usession.push({...this.users[index]});//inserts the object into the empty array
                    //this.updateLocalStorage();
                    this.mensaje("Login success", "success");

                    //setTimeout(function(){ location.href = "index.html" }, 1500);

                }else{
                    this.mensaje("Wrong user or password", "error");
                }
            }else{
                this.mensaje("User and password are required", "error");
            }
        },
        mensaje: function (msj, icono) {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-center',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            Toast.fire({
                icon: icono,
                title: msj
            })
        },
    },
    created(){
        /*if (localStorage.getItem('users') !== null) {
            this.newArrUsers = JSON.parse(localStorage.getItem('users'));
            this.pos = JSON.parse(localStorage.getItem('pos'));
            this.nPetsAdopted = JSON.parse(localStorage.getItem('nadopt'));
        }else{
            this.listData();
            this.pos = this.pos;
            this.nPetsAdopted = this.nPetsAdopted;
        }*/
    }
});
