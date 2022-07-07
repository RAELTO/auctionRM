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
            rmp: 0,
            collection: []
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
        trigger: 0,//to be used in packages modals to show or not the return button
        amount: 0,
        onMachine: 0,
        attemptsM: 0,
        minutes: 2,
        winner: '',
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
                    price: 0,
                    amount: 0,
                    startCounter: false,
                    check: false,
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
        openPack(){
            if (this.trigger == 0) {
                this.trigger = 1;
            }else{
                this.trigger = 0;
            }
        },
        buyFromIndex(){
            if (this.option === 'pse' || this.option === 'nequi') {
                const index = this.users.findIndex((object) => {
                    return object.username == this.usession[0].username;
                });
                this.usession[0].rmp += this.packages[this.pos].rmp;
                this.users[index].rmp = this.usession[0].rmp;
                this.updateLocalStorage();
                this.option = '';
                this.mensaje("Your purchase has been made", "success");
            }else{
                this.mensaje("Please select one payment method", "error");
            }
            
        },
        buyFromLogin(){
            if (this.option === 'pse' || this.option === 'nequi') {
                const index = this.users.findIndex((object) => {
                    return object.username == this.users[this.users.length - 1].username;
                });
                this.users[index].rmp += this.packages[this.pos].rmp;
                this.updateLocalStorage();
                this.option = '';
                this.mensaje("Your purchase has been made", "success");
            }else{
                this.mensaje("Please select one payment method", "error");
            }
        },
        bidUp(item){//ofertar
            if (item.amount <= item.price) {
                this.mensaje("The amount must be greater than the actual price", "error");
            }else{
                if (this.usession[0].rmp < item.price) {
                    this.mensaje("Insufficient RMP, please buy more", "error");
                }else{
                    const pos = this.users.findIndex((object) => {
                        return object.username == this.usession[0].username;
                    });
                    //this.users[pos].rmp -= item.amount;
                    this.usession[0].rmp -= item.amount;
                    item.price = Math.round(item.amount*1.1);
                    this.mensaje("Your bid has been made!", "success");
                    item.startCounter = true;
                    this.winner = this.usession[0].username;

                    if(this.attemptsM == 0){
                        this.users[pos].rmp = this.usession[0].rmp;
                        console.log('HOLA AQUI');
                        this.updateLocalStorage();
                    }

                    this.onMachine = 1;
                    if (this.onMachine == 1) {
                        if (this.attemptsM > 0) {
                            this.attemptsM -= 1;
                            function machineBid(){
                                item.price = Math.round(item.price*1.1);
                                this.winner = '',
                                alert('Oops the machine has made a new bid');
                            }
                            setTimeout(function(){ machineBid(); }, 2500);
                        }else{
                            this.onMachine = 0;
                            item.check = true;
                            this.updateLocalStorage();
                        }
                    }
                }
            }
        },
        setWinner(item){
            const pos = this.users.findIndex((object) => {
                return object.username == this.usession[0].username;
            });
            if (this.winner === this.usession[0].username) {
                const date = new Date();
                this.users[pos].collection.push({...item, qty: 1, datePurchased: date.toLocaleDateString()});
                this.users[pos].collection = this.users[pos].collection.reduce((acc, cv) => {
                    const elementExists = acc.find(e => e.name === cv.name);
                    if (elementExists) {
                    return acc.map((e) => {
                        if (e.name === cv.name) {
                        return {
                            ...e,
                            qty: e.qty + cv.qty,
                            amount: (e.amount + cv.amount)/2
                        }
                        }
                        return e;
                    });
                    }
                    return [...acc, cv];
                }, []);
                console.log(this.users[pos]);
                this.usession[0] = this.users[pos];
                this.updateLocalStorage();
                this.resetCard(item);
                this.mensaje("Congrats! the card is now yours!", "success");
                setTimeout(function(){ location.href = 'index.html' }, 1000);
            }else if(this.winner == ''){
                this.mensaje("Oops The machine has win the bid, better luck the next time", "warning");
            }
        },
        getOut(item){
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger'
                },
                buttonsStyling: false
            })       
            swalWithBootstrapButtons.fire({
                title: 'Do you want to quit from this auction?',
                text: "If yes, Your Points will be returned",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, Quit',
                cancelButtonText: 'No, Cancel',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    const pos = this.users.findIndex((object) => {
                        return object.username == this.usession[0].username;
                    });
                    this.usession[0].rmp = this.users[pos].rmp;
                    this.amount = 0;
                    this.resetCard(item);
                    this.mensaje("Your points were returned", "success");
                    this.updateLocalStorage();
                } else if (
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                }
            })

        },
        resetCard(item){
            item.check = false;
            item.startCounter = false;
            item.amount = 0;
            switch (item.rarity) {
                case "common":
                    item.price = 100;
                    break;
                case "uncommon":
                    item.price = 150;
                    break;
                case "rare":
                    item.price = 200;
                    break;
                case "epic":
                    item.price = 250;
                    break;
                case "legendary":
                    item.price = 300;
                    break;

                default:
                    break;
            }
            function random(min, max) {
                return Math.floor((Math.random() * (max - min + 1)) + min);
            }
            this.attemptsM = random(1,4);
            this.updateLocalStorage();
        },
        mensaje: function (msj, icono) {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-center',
                showConfirmButton: false,
                timer: 1500,
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
            localStorage.setItem('cards', JSON.stringify(this.cards));
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

        if (localStorage.getItem('cards') !== null) {
            this.cards = JSON.parse(localStorage.getItem('cards'));
        }else{
            this.listCards();
        }

        function random(min, max) {
            return Math.floor((Math.random() * (max - min + 1)) + min);
        }

        this.attemptsM = random(1,4);
    },
});
