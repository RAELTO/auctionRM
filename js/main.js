//LOGIC

var app = new Vue({
    el: '#app',
    data: {
        users: [],
        usession: [],//stores user session profile
        newUser: {
            username: '',
            password: '',
            email: '',
            rmp: 0,
            collection: [],
            accumulator: 0
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
        onMachine: 0,
        attemptsM: 0,
    },
    methods: {
        addUser(){
            if (
                this.newUser.username.length > 0
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
                    startTimer: 1,
                    check: false,
                    minutes: 0,
                    seconds: 30,
                    winner: '',
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
                if (this.usession[0].rmp < item.price || item.amount > this.usession[0].rmp ) {
                    this.mensaje("Insufficient RMP, please buy more", "error");
                }else{
                    const pos = this.users.findIndex((object) => {
                        return object.username == this.usession[0].username;
                    });
                    item.price = Math.round(item.amount*1.1);
                    this.mensaje("Your bid has been made!", "success");
                    item.startCounter = true;
                    item.winner = this.usession[0].username;
                    this.users[pos].rmp = this.usession[0].rmp;
                    this.updateLocalStorage();

                    this.onMachine = 1;
                    if (this.onMachine == 1) {
                        if (this.attemptsM > 0) {
                            this.attemptsM -= 1;
                            setTimeout(() => { this.machineBid(item) }, 3500);
                        }else{
                            this.onMachine = 0;
                            this.updateLocalStorage();
                        }
                    }
                    
                    if (item.startTimer === 1) {
                        this.timer(item);
                        item.startTimer = 0;
                        this.updateLocalStorage();
                    }

                }
            }
        },
        timer(item){
            const myTimer = () => {
                if(item.seconds != 0){
                    item.seconds -= 1;
                    this.updateLocalStorage();
                }else{
                    item.seconds = 60;
                    item.minutes -= 1;
                    this.updateLocalStorage();
                }
                if(item.minutes == 0 && item.seconds == 0){
                    myStop();
                    this.setWinner(item);
                    this.usession[0].accumulator = 0;
                    item.startTimer = 1;
                    this.updateLocalStorage();
                }
                }
    
                function myStop() {
                    clearInterval(myInterval);
                    item.startCounter = false;
                    item.minutes = 0;
                    item.seconds = 30;
                }
    
                const myInterval = setInterval(myTimer, 1000);
        },
        machineBid(item){
            item.price = Math.round(item.price*1.1);
            item.winner = 'Machine',
            this.mensaje("Oops! the machine has made a new bid!", "warning");
        },
        setWinner(item){
            const pos = this.users.findIndex((object) => {
                return object.username == item.winner;
            });
            if (item.winner !== 'Machine') {
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
                this.users[pos].rmp -= Math.round(item.price/1.1);
                if (this.usession.length > 0) {
                    this.usession[0] = this.users[pos];
                }
                this.updateLocalStorage();
                this.resetCard(item);
                this.mensaje(`The auction winner for the card number: ${item.id}, is ${item.winner}`, "success");
            }else if(item.winner == 'Machine'){
                this.resetCard(item);
                this.mensaje(`The machine has win the card number: ${item.id}, try it again`, "warning");
            }
        },
        resetCard(item){
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
                timer: 2500,
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

        this.attemptsM = random(1,3);

        /*if (this.cards.length > 0) {
            const index = this.cards.findIndex((object) => {
                return object.id == this.id;
            });
            if (this.cards[index].startTimer === 1) {
                this.timer(item);
                this.cards[index].startTimer = 0;
                this.updateLocalStorage();
            }
        }*/

    },
});
