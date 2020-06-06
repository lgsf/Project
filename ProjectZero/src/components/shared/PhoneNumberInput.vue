<template>
    <v-text-field 
        maxlength="10" 
        :value="inputNumber" 
        v-on:keydown="keyDownEvent" 
        v-on:input="$emit('input', $event)" 
        label="Telefone"
    ></v-text-field>
</template>

<script>
    export default {
        props: ["inputNumber"],
        data () {
            return {
            }
        },
        methods: {
            keyDownEvent(e){
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