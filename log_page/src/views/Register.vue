<template>
    <div class="register-container">
        <div class="register">
            <form @submit.prevent="register" class="form-container">
                <input v-model="pseudo" placeholder="Login"/>
                <input v-model="password" placeholder="Password" type="password"/>
                <input v-model="passwordCheck" placeholder="Repeat password" type="password"/>
                <button type="submit">Register</button>
            </form>
        </div>
        <form @submit.prevent="uploadImage">
            <label for="file-upload" class="custom-file-upload">
                <button type="button" @click="chooseImage"><span>Choose Profil Pic (Optionnal) </span><span v-if="imageDataURL">✅</span></button>
            </label>
            <input id="file-upload" type="file" accept="image/*" ref="imageInput" style="display: none" @change="onImageSelect"/>
        </form>
        <div v-if="matrixIndex > 0">
            <p class="error">{{ matrixError[matrixIndex] }}</p>
        </div>
    </div>
</template>

<script>

import axios from 'axios';
import router from '../router/router'; 
export default {
    name: 'Register-Page',
    data()
    {
        return {
            pseudo: '',
            passwordCheck: '',
            password: '',
            matrixError: [
                'allright',
                'Passwords do not match',
                'Password should be between 8 and 20 caracteres',
                'Login should be between 3 and 8 caracteres',
                'You must not have an empty field',
                'User already exists',
                'Bad File Format (required .png .jpg)'
            ],
            matrixIndex: 0,
            imageDataURL: null,
        }
    },
    methods: 
    {
        handleInputErrors()
        {
            this.matrixIndex = 0;
            if (this.password !== this.passwordCheck)
                this.matrixIndex = 1;
            if (this.password.length < 8
                || this.password.length > 20)
                this.matrixIndex = 2;
            if (this.pseudo.length < 3
                || this.pseudo.length > 8)
                this.matrixIndex = 3;
            if (this.pseudo === ''
                || this.password === ''
                || this.passwordCheck === '')
                this.matrixIndex = 4;
        },
        async register()
        {
            this.handleInputErrors()
            if (this.matrixIndex > 0)
                return ;
            try 
            {
                const res = await axios.post('http://localhost:3000/users/signup', { 
                    pseudo: this.pseudo,
                    password: this.password,
                    isConnected: true,
                    image: this.imageDataURL });
                console.log('res :', res);
            }
            catch(e)
            {
                console.error('Error registering user:', e);
                console.log(e);
                this.matrixIndex = 5;
                return ;
            }
            this.resetData();
            console.log(router)
            router.push('/')
        },
        resetData()
        {
            this.pseudo = '';
            this.passwordCheck = '';
            this.password = '';
        },
        chooseImage() 
        {
            this.$refs.imageInput.click();
        },
        onImageSelect(event) {
            const file = event.target.files[0];
            if (!(file.type === 'image/png' 
                || file.type === 'image/jpeg'
                || file.type === 'image/jpg'))
            {
                this.matrixIndex = 6;
                this.imageDataURL = null;
                return ;
            }
            
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    this.imageDataURL = reader.result;
                };
                reader.readAsDataURL(file);
            }
        },
    }
}
</script>

<style>
.register-container
{
    display: flex;
        flex-direction: column; /* Pour aligner verticalement les éléments */
        align-items: center;
}

.form-container 
{
    display: flex;
    flex-direction: column;
}

#file-upload 
{
    display: none;
}
</style>