<template>
 <form>
    <h4 class="center-align indigo-text text-darken-2">Configurações</h4><br>
    <div class="row">
      <div class="col s12 m6 l4"/>
      <div class="col s12 m6 l4">
        <div class="field">
          <label class="label">Tema</label>
          <div class="control">
            <div class="select">
                <select v-model="testVal">
                  <option v-for="item in items" v-bind:key="item" :value="item">{{item}}</option>
                </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
  export default {
    data: () => ({
      items: ['DarkBlue', 'Orange', 'Gray'],
      testVal: null
    })
  }
</script>
