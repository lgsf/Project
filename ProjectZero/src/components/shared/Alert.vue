<template>
    <div>
    <v-alert v-if="errorMessage" type="error" dismissible v-model="alertError" @input="clearError"> {{ errorMessage }}</v-alert>
    <v-alert v-if="infoMessage" type="info" dismissible v-model="alertInfo" @input="clearInfo"> {{ infoMessage }}</v-alert>
    <v-alert v-if="successMessage" type="success" dismissible v-model="alertSuccess" @input="clearSuccess"> {{ successMessage }}</v-alert>
    <v-alert v-if="warningMessage" type="warning" dismissible v-model="alertWarning" @input="clearWarning"> {{ warningMessage }}</v-alert>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                alertError: true,
                alertInfo: true,
                alertSuccess: true,
                alertWarning: true,
            }
        },
        computed: {
            errorMessage(){
                return this.$store.getters.errorMessage
            },
            infoMessage(){
                return this.$store.getters.infoMessage
            },
            successMessage(){
                return this.$store.getters.successMessage
            },
            warningMessage(){
                return this.$store.getters.warningMessage
            },
        },
        methods: {
            clearError(){
                this.$store.commit("setErrorMessage", '');
            },
            clearInfo(){
                this.$store.commit("setInfoMessage", '');
            },
            clearSuccess(){
                this.$store.commit("setSuccessMessage", '');
            },
            clearWarning(){
                this.$store.commit("setWarningMessage", '');
            },
        }
    }
</script>