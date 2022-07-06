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
        price: '',
        packages: [
            {id: 1, name: '150 RMP', price: 10_000, rmp: 150}, 
            {id: 2, name: '200 RMP', price: 15_000, rmp: 200},
            {id: 3, name: '250 RMP', price: 20_000, rmp: 250},
            {id: 4, name: '800 RMP', price: 50_000, rmp: 800},
        ],
        pos: '',
        option: '',
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

            const ids = [
                random(1,826),random(1,826),random(1,826),random(1,826),random(1,826),random(1,826),random(1,826),
                random(1,826),random(1,826),random(1,826),random(1,826),random(1,826)
            ]

            await fetch(`https://rickandmortyapi.com/api/character/${ids}`)
                .then(response => response.json())
                .then(data => this.cards = data);

            this.cards = this.cards.map(e => {
                return{
                    ...e,
                    rarity: this.rarityList[random(0, 4)],
                    price: 0
                }
            });

            this.cards.forEach(e => {
                switch (e.rarity) {
                    case "common":
                        e.price = 100;
                        break;
                    case "uncommon":
                        e.price = 150;
                        break;
                    case "rare":
                        e.price = 200;
                        break;
                    case "epic":
                        e.price = 250;
                        break;
                    case "legendary":
                        e.price = 300;
                        break;

                    default:
                        break;
                }
            });
            
        },
        getIndex(index){
            this.pos = index;
        },
        buyFromIndex(){
            if (this.option === 'pse' || this.option === 'nequi') {
                const index = this.users.findIndex((object) => {
                    return object.username == this.usession[0].username;
                });
                this.usession[0].rmp += this.packages[this.pos].rmp;
                this.users[index].rmp += this.packages[this.pos].rmp;
                this.updateLocalStorage();
                this.option = '';
                this.mensaje("Your purchase has been made", "success");
            }else{
                this.mensaje("Please select one payment method", "error");
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

        this.listCards();
    }
});
