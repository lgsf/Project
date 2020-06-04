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
                else{
                    // console.log(e.key)
                    // console.log(this.inputNumber.length)
                    if(this.inputNumber || this.inputNumber.length == 0){
                        this.inputNumber = '(' + e.key + '_)'
                    }
                    else if(this.inputNumber.length == 4){
                        this.inputNumber = this.inputNumber.substring(0,2) + e.key + ') '
                    }
                }
            },
            isNumber(n) { 
                return !isNaN(parseFloat(n)) && !isNaN(n - 0) 
            }
        }
    }
</script>