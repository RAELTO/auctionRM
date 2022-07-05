//LOGIC

var app = new Vue({
    el: '#app',
    data: {
        users: [],
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
                        alert('Your account has been created successfully');
                    }else{
                        alert('Password and confirm password doesnt match');
                    }
                
            }else{
                alert('Pleas fill all the fields');
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
