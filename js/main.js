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
        cards: [],
        rarityList: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
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
                        this.updateLocalStorage();
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
                    this.updateLocalStorage();
                    this.mensaje("Login success", "success");

                    setTimeout(function(){ location.href = "index.html" }, 1500);

                }else{
                    this.mensaje("Wrong user or password", "error");
                }
            }else{
                this.mensaje("User and password are required", "error");
            }
        },
        logout(){
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger'
                },
                buttonsStyling: false
            })       
            swalWithBootstrapButtons.fire({
                title: 'Do you want to logout?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, logout',
                cancelButtonText: 'Cancel',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    this.usession = [];
                    this.updateLocalStorage();
                    this.mensaje("Successfully logged out", "success");
                    setTimeout(function(){ location.href = "login.html" }, 1500);
                } else if (
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                }
            })
        },
        async listCards(){

            function random(min, max) {
                return Math.floor((Math.random() * (max - min + 1)) + min);
            }

            this.randomId.forEach(e => e = random(1, 12));

            console.log(this.randomId);

            await fetch(`https://rickandmortyapi.com/api/character/${this.randomId}`)
                .then(response => response.json())
                .then(data => this.cards = data);

            this.cards = this.cards.map(e => {
                return{
                    ...e,
                    rarity: this.rarityList[random(0, 4)],
                }
            });

            console.log(this.cards);
            
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
        updateLocalStorage(){
            localStorage.setItem('users', JSON.stringify(this.users));
            localStorage.setItem('usession', JSON.stringify(this.usession));
        },
    },
    created(){
        if (localStorage.getItem('users') !== null) {
            this.users = JSON.parse(localStorage.getItem('users'));
        }else{
            this.users = this.users;
        }
        if (localStorage.getItem('usession') !== null) {
            this.usession = JSON.parse(localStorage.getItem('usession'));
        }else{
            this.usession = [];
        }
    }
});
