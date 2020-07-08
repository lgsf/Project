<template>
  <v-card class="pa-0 body-2" raised min-height="120px">
    <v-row class="ml-1 mr-1">
      <v-col cols="12">
        <v-row>
          <v-col cols="12" class="pt-2 mt-3 text-lg-h3 text-md-h4">
            <v-tooltip bottom v-if="task.priority == 'Critica'">
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  v-on="on"
                  color="error"
                  v-if="task.priority == 'Critica'"
                >mdi-chevron-triple-up</v-icon>
              </template>
              <span>{{task.priority}} prioridade</span>
            </v-tooltip>
            <v-tooltip bottom v-if="task.priority == 'Baixa'">
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  v-on="on"
                  color="success"
                  v-if="task.priority == 'Baixa'"
                >mdi-chevron-down</v-icon>
              </template>
              <span>{{task.priority}} prioridade</span>
            </v-tooltip>
            <v-tooltip bottom v-if="task.priority == 'Media'">
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  v-on="on"
                  color="yellow"
                  v-if="task.priority == 'Media'"
                >mdi-chevron-up</v-icon>
              </template>
              <span>{{task.priority}} prioridade</span>
            </v-tooltip>
            <v-tooltip bottom v-if="task.priority == 'Alta'">
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  v-on="on"
                  color="error"
                  v-if="task.priority == 'Alta'"
                >mdi-chevron-double-up</v-icon>
              </template>
              <span>{{task.priority}} prioridade</span>
            </v-tooltip>

            <span class="font-weight-medium">Tarefa:</span>
            <span class="font-weight-regular">{{task.name}}</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            v-if="!!task.started_date"
            cols="12"
            sm="6"
            md="12"
            lg="6"
            class="text-lg-left body-2 pt-0 pb-0 pr-0 mr-0"
          >
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <div v-bind="attrs" v-on="on" class="data-field">
                  <span class="font-weight-small">
                    <b>Início:</b>
                  </span>
                  {{task.started_date}}
                </div>
              </template>
              <span>{{task.started_date}}</span>
            </v-tooltip>
          </v-col>
          <v-col
            v-if="!!task.end_date"
            cols="12"
            sm="6"
            md="12"
            lg="6"
            class="text-sm-right text-md-left text-lg-right body-2 pt-0 pb-0 pl-lg-0 ml-lg-0"
          >
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <div v-bind="attrs" v-on="on" class="data-field">
                  <span class="font-weight-small">
                    <b>Fim:</b>
                  </span>
                  {{task.end_date}}
                </div>
              </template>
              <span>{{task.end_date}}</span>
            </v-tooltip>
          </v-col>
        </v-row>
        <v-row class="justify-start">
          <v-col v-if="!!task.tags && !showXSmallTags" cols="12" class="pr-0">
            <span v-for="(tag,i) in task.tags" :key="i">
              <v-chip
                class="ma-1"
                small
                :color="tag.color + ' lighten-2'"
                @click="showXSmallTags = !showXSmallTags"
              >{{tag.text}}</v-chip>
            </span>
          </v-col>
          <v-col v-if="!!task.tags && showXSmallTags" cols="12" class="pr-0">
            <span v-for="(tag,i) in task.tags" :key="i">
              <v-chip
                x-small
                label
                class="ma-1"
                :color="tag.color + ' lighten-2'"
                @click="showXSmallTags = !showXSmallTags"
              >&nbsp;&nbsp;&nbsp;</v-chip>
            </span>
          </v-col>
          <v-col cols="12" class="pl-0 pt-0 pr-0 pb-0">
            <v-btn
              absolute
              style="right:3px; top: 1px"
              icon
              class="ma-0"
              color="blue-grey lighten-3"
              @click="executeAction"
            >
              <v-icon>mdi-eye</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="justify-start pt-1 pb-0" cols="12">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-if="task.users && task.users.name"
                  v-bind="attrs"
                  v-on="on"
                  color="gray lighten-2 small-button"
                  @click="executeAction"
                >
                  <v-icon small>mdi-account-check</v-icon>
                </v-btn>
              </template>
              <span>
                <span class="font-weight-medium">Responsável:</span>
                {{task.users.name}}
              </span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-if="task.estimated_duration"
                  v-bind="attrs"
                  v-on="on"
                  color="gray lighten-2 small-button"
                  @click="executeAction"
                >
                  <v-icon small>mdi-clock-time-three-outline</v-icon>
                </v-btn>
              </template>
              <span>({{task.estimated_duration}} horas)</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-if="task.files && task.files.length"
                  v-bind="attrs"
                  v-on="on"
                  color="gray lighten-2 small-button"
                  @click="executeAction"
                >
                  <v-icon small>mdi-paperclip</v-icon>
                </v-btn>
              </template>
              <span>{{(!task.files ? '' : task.files.length == 1 ? '1 anexo' : `${task.files.length} anexos`)}}</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>
<style scoped>
.data-field {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.small-button {
  width: 16px;
  height: 16px;
}
</style>
<script>
export default {
  props: {
    task: {
      type: Object,
      default: () => ({})
    },
    action: () => {}
  },
  data() {
    return {
      showXSmallTags: true
    };
  },
  methods: {
    executeAction() {
      if (!this.action) return;
      this.action();
    }
  }
};
</script>
