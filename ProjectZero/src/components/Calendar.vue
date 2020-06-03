<template>
  
    <v-col class="xs-12 sm-6" justify="center">
      <v-sheet height="64">
        <v-toolbar flat color="primary">
          <v-btn color="primary" class="mr-1 " small @click.stop="dialog = true">
            <v-icon>add</v-icon>
          </v-btn>
          <v-btn color="primary" class="mr-1"  small @click="setToday">
            Hoje
          </v-btn>
          <v-btn color="primary" class="mr-1" small @click="prev">
            <v-icon >skip_previous</v-icon>
          </v-btn>
          <v-btn color="primary" class="mr-1" small @click="next">
            <v-icon >skip_next</v-icon>
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
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 dias</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>

      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-container>
            <v-form @submit.prevent="addEvent" >
              <v-text-field v-model="name" type="text" label="Qual o título do lembrete?"></v-text-field>
              <v-text-field v-model="details" type="text" label="Quais os detalhes?"></v-text-field>
              <v-text-field v-model="start" type="date" label="Qual o início?"></v-text-field>
              <v-text-field v-model="end" type="date" label="Qual o fim?"></v-text-field>
              <v-text-field v-model="color" type="color" label="Escolha a cor do lembrete"></v-text-field>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text color="blue darken-1"  @click="close">
                Limpar
              </v-btn>
              
              <v-btn type="submit" text color="blue darken-1"  @click.stop="dialog = false">
                Salvar
              </v-btn>
              </v-card-actions>
            </v-form>
          </v-container>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogDate" max-width="500">
        <v-card>
          <v-container>
            <v-form @submit.prevent="addEvent" >
              <v-text-field v-model="name" type="text" label="Qual o título do lembrete?"></v-text-field>
              <v-text-field v-model="details" type="text" label="Quais os detalhes?"></v-text-field>
              <v-text-field v-model="start" type="date" label="Qual o início?"></v-text-field>
              <v-text-field v-model="end" type="date" label="Qual o fim?"></v-text-field>
              <v-text-field v-model="color" type="color" label="Escolha a cor do lembrete"></v-text-field>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text color="blue darken-1"  @click="close">
                Limpar
              </v-btn>
              
              <v-btn type="submit" text color="blue darken-1"  @click.stop="dialog = false">
                Salvar
              </v-btn>
              </v-card-actions>
            </v-form>
          </v-container>
        </v-card>
      </v-dialog>

<v-sheet height="400">
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
  offset-x
  >
  <v-card color="grey lighten-4" :width="350" flat>
    <v-toolbar :color="selectedEvent.color" dark>
      <v-btn @click="deleteEvent(selectedEvent.id)" icon>
        <v-icon>delete</v-icon>
      </v-btn>
      <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
      <div class="flex-grow-1"></div>
    </v-toolbar>

    <v-card-text>
      <form v-if="currentlyEditing !== selectedEvent.id">
        {{ selectedEvent.details }}
      </form>
      <form v-else>
        <textarea-autosize
        v-model="selectedEvent.details"
        type="text"
        style="width: 100%"
        :min-height="100"
        placeholder="Add">
      </textarea-autosize>
    </form>
  </v-card-text>

  <v-card-actions>
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
import { db } from '@/main'
export default {
  data: () => ({
    today: new Date().toISOString().substr(0, 10),
    focus: new Date().toISOString().substr(0, 10),
    type: 'month',
    typeToLabel: {
      month: 'Mês',
      week: 'Semana',
      day: 'Dia',
      '4day': '4 Dias',
    },
    name: null,
    details: null,
    start: null,
    end: null,
    color: '#1976D2', // default event color
    currentlyEditing: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    dialog: false,
    dialogDate: false
  }),
  mounted () {
    this.getEvents()
  },
  computed: {
    title () {
      const { start, end } = this
      if (!start || !end) {
        return ''
      }
      const startMonth = this.monthFormatter(start)
      const endMonth = this.monthFormatter(end)
      const suffixMonth = startMonth === endMonth ? '' : endMonth
      const startYear = start.year
      const endYear = end.year
      const suffixYear = startYear === endYear ? '' : endYear
      const startDay = start.day + this.nth(start.day)
      const endDay = end.day + this.nth(end.day)
      switch (this.type) {
        case 'month':
        return `${startMonth} ${startYear}`
        case 'week':
        case '4day':
        return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`
        case 'day':
        return `${startMonth} ${startDay} ${startYear}`
      }
      return ''
    },
    monthFormatter () {
      return this.$refs.calendar.getFormatter({
        timeZone: 'UTC', month: 'long',
      })
    }
  },
  methods: {
    async getEvents () {
      let snapshot = await db.collection('calEvent').get()
      const events = []
      snapshot.forEach(doc => {
        let appData = doc.data()
        appData.id = doc.id
        events.push(appData)
      })
      this.events = events
    },
    close() {
      this.title = ''
      this.name = ''
      this.detail =''
      this.date= ''
      this.dialog = false
    },
    setDialogDate( { date }) {
      this.dialogDate = true
      this.focus = date
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
    async addEvent () {
      if (this.name && this.start && this.end) {
        await db.collection("calEvent").add({
          name: this.name,
          details: this.details,
          start: this.start,
          end: this.end,
          color: this.color
        })
        this.getEvents()
        this.name = ''
        this.details = ''
        this.start = ''
        this.end = ''
        this.color = ''
      } else {
        alert('Você deve inserir o nome, início e fim do evento')
      }
    },
    editEvent (ev) {
      this.currentlyEditing = ev.id
    },
    async updateEvent (ev) {
      await db.collection('calEvent').doc(this.currentlyEditing).update({
        details: ev.details
      })
      this.selectedOpen = false
      this.currentlyEditing = null
    },
    async deleteEvent (ev) {
      await db.collection("calEvent").doc(ev).delete()
      this.selectedOpen = false
      this.getEvents()
    },
    showEvent ({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
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