<template>
  <div class="Sidenav">
    <a
      id="sidenav-trigger-icon"
      href="#"
      data-target="slide-out"
      class="sidenav-trigger show-on-large"
    >
      <i class="material-icons">menu</i>
    </a>
    <ul id="slide-out" class="sidenav">
      <li>
        <div class="user-view indigo darken-2">
          <div class="background">
            <!-- <img src="images/office.jpg"> -->
          </div>
          <!-- <a href="#user"><img class="circle" src="images/yuna.jpg"></a> -->
          <a href="#name">
            <span class="name">Your logo here!</span>
          </a>
          <br />
        </div>
      </li>
      <li>
        <router-link :to="{ name: 'Home' }">
          <i class="material-icons">home</i>
          <span>Home</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'Config' }">
          <i class="material-icons">settings</i>
          <span>Configuração</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'Clientes' }">
          <i class="material-icons">contacts</i>
          <span>Clientes</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'Processos' }">
          <i class="material-icons">event_note</i>
          <span>Processos</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'Fluxos' }">
          <i class="material-icons">receipt</i>
          <span>Fluxos</span>
        </router-link>
      </li>
      <li class="no-padding">
        <ul class="collapsible collapsible-accordion">
          <li>
            <a class="collapsible-header menu-padding">
              <i class="material-icons">account_box</i>
              <span>Usuários</span>
            </a>
            <div class="collapsible-body">
              <ul>
                <li>
                  <router-link class="submenu-padding" :to="{ name: 'Processos' }">
                    <i class="material-icons">person</i>
                    <span>Administrar Usuários</span>
                  </router-link>
                </li>
                <li>
                  <router-link class="submenu-padding" :to="{ name: 'Processos' }">
                    <i class="material-icons">people</i>
                    <span>Administrar Grupos</span>
                  </router-link>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </li>
      <li>
        <router-link :to="{ name: 'Notificacao' }">
          <i class="material-icons">notifications</i>
          <span>Notificações</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Sidenav",
  data() {
    return {};
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#sidenav-trigger-icon {
  padding: 20px;
}
.menu-padding {
  padding: 0 32px;
}
.submenu-padding {
  padding: 0 50px !important;
}
</style>
