<template>
    <v-col class="xs-12 sm-6" justify="center">
       <div class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          v-if="isLoading"
        ></v-progress-circular>
        </div>
      <v-sheet height="64" v-if="!isLoading">
        <v-toolbar  color="primary">
          <v-btn color="primary" class="mr-1" small @click.stop="setDialog()">
            <v-icon>add</v-icon>
          </v-btn>
          <v-btn color="primary" class="mr-1"  small @click="setToday">
            Hoje
          </v-btn>
          <v-btn color="primary" class="mr-1" small @click="prev">
            <v-icon >keyboard_arrow_left</v-icon>
          </v-btn>
          <v-btn color="primary" class="mr-1" small @click="next">
            <v-icon >keyboard_arrow_right</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn small color="primary" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Dia</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Semana</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Mês</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>

      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-toolbar class="primary ">
          <h3 class="white--text">{{ name || "Título" }} - {{toMoment}} <span v-if="startTime">às</span> {{startTime}}</h3>
            <v-spacer></v-spacer>
          <v-icon right class="white--text">calendar_today</v-icon>
        </v-toolbar>
          <v-container>
            <v-form v-model="isNotValid" >
              <v-text-field @input="setName" v-model="name" :rules="[rules.nameRequired]" type="text" label="Qual o título do lembrete?"></v-text-field>
              <v-text-field @input="setDetails" v-model="details" type="text" label="Quais os detalhes?"></v-text-field>
              <v-text-field @input="setStart" v-model="start"  type="date" label="Qual a data de início?"></v-text-field>
              <v-text-field @input="setStartTime" v-model="startTime" type="time" label="Qual o horário de início?"></v-text-field>
              <v-text-field @input="setEnd" v-model="end"  type="date" label="Qual a data de encerramento?"></v-text-field>
              <v-text-field @input="setEndTime" v-model="endTime"  type="time" label="Qual o horário de encerramento?"></v-text-field>
             <div>
                <v-radio-group v-model="pickedColor" label="Qual a cor:" :mandatory="true" row>
                  <v-radio label="Preto" value="true"></v-radio>
                  <v-radio label="Outra" value="false"></v-radio>
                </v-radio-group>
              </div>
              <v-color-picker @input="setColor" v-model="color" v-if="pickedColor == 'false'" />
              <div>
                <v-radio-group v-model="picked" label="Recipiente:" :mandatory="true" row>
                  <v-radio label="Todos" value="Todos" @change="editUser([])"></v-radio>
                  <v-radio label="Somente eu" @change="editUser([usersModified[0]])" value="Eu"></v-radio>
                  <v-radio label="Usuários" @change="editUser([])" value="Usuários"></v-radio>
                </v-radio-group>
              </div>
              <v-autocomplete
                  v-if="picked === 'Usuários'"
                  v-model="editingUser"
                  :items="users"
                  color="primary"
                  item-text="name"
                  label="Definir usuários para receber evento"
                  return-object
                  dense
                  multiple
                  @input="editUser"
                ></v-autocomplete>
              <v-card-actions>
                <v-spacer></v-spacer>
              <v-btn text color="blue darken-1"  @click="clean">
                  Limpar
                </v-btn>
                  <v-btn text color="blue darken-1"  @click="close">
                  Fechar
              </v-btn>
              <v-btn  text color="blue darken-1" :disabled="!isNotValid"  @click="save">
                Salvar
              </v-btn>
              </v-card-actions>
            </v-form>
          </v-container>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogDate" max-width="500">
        <v-card>
          <v-toolbar class="primary ">
          <h3 class="white--text">{{ name || "Título" }} - {{toMoment}} <span v-if="startTime">às</span> {{startTime}}</h3>
            <v-spacer></v-spacer>
          <v-icon right class="white--text">calendar_today</v-icon>
        </v-toolbar>
          <v-container>
            <v-form v-model="isNotValid"  >
              <v-text-field @input="setName" :rules="[rules.nameRequired]" v-model="name" type="text" label="Qual o título do lembrete?"></v-text-field>
              <v-text-field @input="setDetails" v-model="details" type="text" label="Quais os detalhes?"></v-text-field>
              <v-text-field @input="setStart" v-model="start"  type="date" label="Qual a data de início?"></v-text-field>
              <v-text-field @input="setStartTime" v-model="startTime" type="time" label="Qual o horário de início?"></v-text-field>
              <v-text-field @input="setEnd" v-model="end"  type="date" label="Qual a data de encerramento?"></v-text-field>
              <v-text-field @input="setEndTime" v-model="endTime"  type="time" label="Qual o horário de encerramento?"></v-text-field>
              <div>
                <v-radio-group v-model="pickedColor" label="Qual a cor:" :mandatory="true" row>
                  <v-radio label="Preto" value="true"></v-radio>
                  <v-radio label="Outra" value="false"></v-radio>
                </v-radio-group>
              </div>
              <v-color-picker @input="setColor" v-model="color" v-if="pickedColor == 'false'" />
             <div>
                <v-radio-group v-model="picked" label="Recipiente:" :mandatory="true" row>
                  <v-radio label="Todos" value="Todos" @change="editUser([])"></v-radio>
                  <v-radio label="Somente eu" @change="editUser([usersModified[0]])" value="Eu"></v-radio>
                  <v-radio label="Usuários" @change="editUser([])" value="Usuários"></v-radio>
                </v-radio-group>
              </div>
              <v-autocomplete
                  v-if="picked == 'Usuários'"
                  v-model="editingUser"
                  :items="users"
                  color="primary"
                  item-text="name"
                  label="Definir usuários para receber evento"
                  return-object
                  dense
                  multiple
                  @input="editUser"
                ></v-autocomplete>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text color="blue darken-1"  @click="clean">
                Limpar
              </v-btn>
                <v-btn text color="blue darken-1"  @click="close">
                Fechar
              </v-btn>
              <v-btn  text color="blue darken-1" :disabled="!isNotValid"  @click="save">
                Salvar
              </v-btn>
              </v-card-actions>
            </v-form>
          </v-container>
        </v-card>
      </v-dialog>

<v-sheet height="500" v-if="!isLoading">
  <v-calendar
  ref="calendar"
  locale="pt"
  v-model="focus"
  color="primary"
  :events="events"
  :event-color="getEventColor"
  :event-margin-bottom="3"
  :now="today"
  :type="type"
  @click:event="showEvent"
  @click:more="viewDay"
  @click:date="setDialogDate"
  @change="updateRange"
  ></v-calendar>
  <v-menu
  v-model="selectedOpen"
  :close-on-content-click="false"
  :activator="selectedElement"
  >
  <v-card color="grey lighten-4" :min-width="300" >
    <v-toolbar :color="selectedEvent.color" dark>
      <v-btn @click="deleteEvent(selectedEvent.id)" icon>
        <v-icon>delete</v-icon>
      </v-btn>
      <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <form v-if="currentlyEditing !== selectedEvent.id">
        Detalhes do evento: {{ selectedEvent.details }}<br>
        Data de início: {{ toMomentFunc(selectedEvent.start) }}<br>
        Data de encerramento: {{ toMomentFunc(selectedEvent.end) }}
      </form>
       <form v-else>
        <v-text-field @input="setName" :rules="[rules.nameRequired]" v-model="selectedEvent.name" type="text" label="Qual o título do lembrete?"></v-text-field>
        <v-text-field @input="setDetails" v-model="selectedEvent.details" type="text" label="Quais os detalhes?"></v-text-field>
        <v-text-field @input="setStart" v-model="selectedEventComputedStart"  type="date" label="Qual a data de início?"></v-text-field>
        <v-text-field @input="setStartTime" v-model="selectedEventComputedStartTime" type="time" label="Qual o horário de início?"></v-text-field>
        <v-text-field @input="setEnd" v-model="selectedEventComputedEnd"  type="date" label="Qual a data de término?"></v-text-field>
        <v-text-field @input="setEndTime" v-model="selectedEventComputedEndTime"  type="time" label="Qual o horário de encerramento?"></v-text-field>
    </form>
     
  </v-card-text>

  <v-card-actions>
    <v-spacer></v-spacer>
    <v-btn text color="blue darken-1" @click="selectedOpen = false">
      Fechar
    </v-btn>
    <v-btn color="blue darken-1" v-if="currentlyEditing !== selectedEvent.id" text @click.prevent="editEvent(selectedEvent)">
      Editar
    </v-btn>
    <v-btn color="blue darken-1" text v-else type="submit" @click.prevent="updateEvent(selectedEvent)">
      Salvar
    </v-btn>
  </v-card-actions>
</v-card>
</v-menu>
</v-sheet>
</v-col>
</template>

<script>
import { moment } from '@/main'
import { mapActions, mapState } from "vuex"


const computed = mapState("calendar", {
  events: state => state.events,
  name: state => state.name,
  details: state => state.details,
  start: state => state.start,
  end: state => state.end,
  startTime: state => state.startTime,
  endTime: state => state.endTime,
  color: state => state.color,
  editingUser: state => state.editingUser
})

const computedUser = mapState("users", {
  users: state => state.userListModified,
  usersModified: state => state.userJustMe,
})

export default {

  data: () => ({
    isNotValid: false,
      rules: {
        nameRequired: value => !!value || `O campo Título é obrigatório.`,
      },
    today: moment().format('YYYY-MM-DD'),
    focus: moment().format('YYYY-MM-DD'),
    type: 'month',
    typeToLabel: {
      month: 'Mês',
      week: 'Semana',
      day: 'Dia'
    },
    currentlyEditing: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    dialog: false,
    dialogDate: false,
    picked: 'Todos',
    pickedColor: 'true'
  }),
  mounted () {
    this.getEvents()
    this.readUsers()
  },
  computed: Object.assign({}, computed, computedUser, {
    isLoading() {
      return this.$store.state.general.isLoading
    },
    isUser() {
      return this.$store.state.auth.user.uid
    },
    toMoment(){
      return moment(this.start).format('DD-MM-YYYY')
    },
    selectedEventComputedStart(){
      return moment(this.selectedEvent.start).format('YYYY-MM-DD')
    },
    selectedEventComputedStartTime(){
      if(this.selectedEvent.start.length > 10)
      return moment(this.selectedEvent.start).format('HH:mm:ss')
    },
    selectedEventComputedEnd(){
      return moment(this.selectedEvent.end).format('YYYY-MM-DD')
    },
    selectedEventComputedEndTime(){
      if(this.selectedEvent.start.length > 10)
      return moment(this.selectedEvent.end).format('HH:mm:ss')
    },
  }),
  methods: {
    ...mapActions("calendar", 
    [
    "setEvent", 
    "addEvent", 
    "setName", 
    "setDetails", 
    "setStart",
    "setEnd",
    "setStartTime",
    "setEndTime",
    "setColor",
    "updateEventStore",
    "deleteEventStore",
    "editUser"
    ]),
    ...mapActions("users", [
  "readUsers"
  ]),
    getEvents () {
      this.setEvent()
    },
     toMomentFunc(date){
       if(date == undefined)
       return
       else
        {
          if(date.length > 10)
            return moment(date).format('DD/MM/YYYY, HH:mm:ss')
          else
            return moment(date).format('DD/MM/YYYY')
        }
    },
    clean() {
      let clean = ''
      this.setName(clean) 
      this.setDetails(clean) 
      this.setEnd(clean) 
      this.setStartTime(clean) 
      this.setEndTime(clean)
      this.editUser([])
      this.setColor("#000000")
      this.pickedColor = 'true'
      this.picked = 'Todos'
    },
    save(){
      this.dialog = false
      this.dialogDate = false
      this.addEvent()
    },
   
    close(){
      this.dialog = false
      this.dialogDate = false
      this.clean()
    },
    setDialogDate({ date }) {
      this.clean()
      this.dialogDate = true
      this.focus = date
      this.setStart(date)
      this.setEnd(date)
    },
    setDialog() {
      this.clean()
      this.dialog = true
      this.setStart(this.today)
      this.setEnd(this.today)
    },
    viewDay ({ date }) {
      this.focus = date
      this.type = 'day'
    },
    getEventColor (event) {
      return event.color
    },
    setToday () {
      this.focus = this.today
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
    editEvent (ev) {
      this.currentlyEditing = ev.id
    },
    updateEvent (ev) {
      this.updateEventStore(ev)
      this.selectedOpen = false
      this.currentlyEditing = null
    },
    deleteEvent (ev) {
      this.deleteEventStore(ev)
      this.selectedOpen = false
    },
    showEvent ({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.setName(event.name)
        this.setDetails(event.details)
        this.setStart(event.start.substr(0,10))
        this.setEnd(event.end.substr(0,10))
        this.setStartTime(event.start.substr(11, event.start.length-1))
        this.setEndTime(event.end.substr(11, event.start.length-1))
        this.selectedElement = nativeEvent.target
        setTimeout(() => this.selectedOpen = true, 10)
      }
      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10)
      } else {
        open()
      }
      nativeEvent.stopPropagation()
    },
    updateRange ({ start, end }) {
      this.start = start
      this.end = end
    },
    nth (d) {
      return d > 3 && d < 21
      ? 'th'
      : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
    }
  }
}
</script>
