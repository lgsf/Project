<template>
    <v-text-field maxlength="10" v-model="inputNumber" v-on:keydown="keyDownEvent" label="Telefone"></v-text-field>
</template>

<script>
    export default {
        data () {
            return {
                inputNumber: null
            }
        },
        methods: {
            keyDownEvent(e){
                console.log(e)
                if(e.code == "Backspace"){
                    return;
                }
                if(!this.isNumber(e.key)){
                    e.preventDefault();
                }
            },
            isNumber(n) { 
                return !isNaN(parseFloat(n)) && !isNaN(n - 0) 
            }
        }
    }
</script>