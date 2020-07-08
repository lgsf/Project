<template>
  <v-combobox
    v-model="value"
    :filter="filter"
    :hide-no-data="!search"
    :items="items"
    :search-input.sync="search"
    hide-selected
    label="Tags"
    multiple
    small-chips
    flat
  >
    <template v-slot:no-data>
      <v-list-item>
        <v-chip :color="`${colors[nonce - 1]} lighten-2`" label small>{{ search }}</v-chip>
      </v-list-item>
    </template>
    <template v-slot:selection="{ attrs, item, parent, selected }">
      <v-chip
        v-if="item === Object(item)"
        v-bind="attrs"
        :color="`${item.color} lighten-2`"
        :input-value="selected"
        label
        small
      >
        <span class="pr-2">{{ item.text }}</span>
        <v-icon small @click="parent.selectItem(item)">close</v-icon>
      </v-chip>
    </template>
    <template v-slot:item="{ index, item }">
      <v-text-field
        v-if="editing === item"
        v-model="editing.text"
        autofocus
        flat
        label="Tag"
        background-color="transparent"
        hide-details
        solo
        @keyup.enter="edit(index, item)"
      ></v-text-field>
      <v-text-field
        v-else-if="editingColor === item"
        v-model="editingColor.color"
        autofocus
        flat
        label="Cor"
        background-color="transparent"
        hide-details
        solo
        @keyup.enter="editColor(index, item)"
      ></v-text-field>
      <v-chip v-else :color="`${item.color} lighten-2`" dark label small>{{ item.text }}</v-chip>
      <v-spacer></v-spacer>
      <v-list-item-action @click.stop>
        <div class="d-flex">
          <v-btn icon @click.stop.prevent="edit(index, item)">
            <v-icon>{{ editing !== item ? 'mdi-pencil' : 'mdi-check' }}</v-icon>
          </v-btn>
          <v-btn icon @click.stop.prevent="editColor(index, item)">
            <v-icon>{{ editingColor !== item ? 'mdi-palette' : 'mdi-check' }}</v-icon>
          </v-btn>
        </div>
      </v-list-item-action>
    </template>
  </v-combobox>
</template>

<script>
export default {
  props: ["value", "availableTags"],
  data: () => ({
    activator: null,
    attach: null,
    colors: [
      "pink",
      "red",
      "deep-orange",
      "orange",
      "amber",
      "yellow",
      "lime",
      "light-green",
      "green",
      "teal",
      "cyan",
      "light-blue",
      "blue",
      "indigo",
      "deep-purple",
      "purple",
      "brown"
    ],
    editing: null,
    editingColor: null,
    index: -1,
    nonce: 1,
    menu: false,
    items: [],
    //model: [],
    x: 0,
    search: null,
    y: 0
  }),

  watch: {
    value(val, prev) {
      if (!val || (prev && val.length === prev.length)) return;

      this.value = val.map(v => {
        if (typeof v === "string") {
          v = {
            text: v,
            color: this.colors[this.nonce - 1]
          };
          this.items.push(v);
          this.nonce++;
        }
        return v;
      });
      this.$emit("input", this.value);
    }
  },

  methods: {
    edit(index, item) {
      if (!this.editing) {
        this.editingColor = null;
        this.editing = item;
        this.index = index;
      } else {
        this.editing = null;
        this.editingColor = null;
        this.index = -1;
      }
    },
    editColor(index, item) {
      if (!this.editingColor) {
        this.editing = null;
        this.editingColor = item;
        this.index = index;
      } else {
        this.editing = null;
        this.editingColor = null;
        this.index = -1;
      }
    },
    filter(item, queryText, itemText) {
      if (item.header) return false;

      const hasValue = val => (val != null ? val : "");

      const text = hasValue(itemText);
      const query = hasValue(queryText);

      return (
        text
          .toString()
          .toLowerCase()
          .indexOf(query.toString().toLowerCase()) > -1
      );
    }
  },
  mounted() {
    if (this.availableTags && this.availableTags.length)
      this.availableTags.forEach(element => this.items.push(element));
    this.nonce = this.items.length + 1;
  }
};
</script>