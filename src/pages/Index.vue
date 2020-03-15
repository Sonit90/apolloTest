/* eslint-disable global-require */
<template>
  <q-page class="flex flex-center">
    <!-- <ApolloQuery
      :query="require('../graphql/queries/allFlats.gql')"
    > -->
    <!-- <template v-slot="{result:{error, data, load}}">
        <h2 v-if="error">
          Произошла ошибка
        </h2>
        <div
          v-if="data"
        > -->
    <q-table
      v-if="allFlats"
      :loading="loading||load"
      style="min-width:600px"
      title="Объекты"
      :data="allFlats"
      :columns="columns"
      row-key="name"
      :pagination.sync="pagination"
    >
      <template v-slot:body-cell-actions="props">
        <q-td class="q-gutter-sm">
          <q-btn
            :icon="matEdit"
            color="primary"
            size="sm"
            @click="editFlat(props.row)"
          />
          <q-btn
            :icon="matDelete"
            color="negative"
            size="sm"
            @click="removeItem(props.row.id)"
          />
        </q-td>
      </template>
      <template v-slot:top-right>
        <q-btn
          label="Создать"
          color="primary"
          size="sm"
          @click="createFlat"
        />
      </template>
    </q-table>
    <!-- </div> -->
    <!-- </template> -->
    <!-- </ApolloQuery> -->

    <q-dialog
      v-model="dialog"
    >
      <q-card
        class="bg-teal text-white"
        style="min-width:600px"
      >
        <q-card-section class="row items-center">
          <span>Создать новый объект</span>
        </q-card-section>
        <q-card-section class="bg-white text-teal">
          <q-input
            label="Название"
            v-model="flat.title"
          />
          <q-input
            label="Площадь"
            type="number"
            v-model="flat.square"
          />
          <q-input
            label="Цена"
            type="number"
            v-model="flat.price"
          />
        </q-card-section>
        <q-card-actions
          class="bg-white text-teal"
          align="right"
        >
          <q-btn
            flat
            label="Отмена"
            color="primary"
            v-close-popup
            no-caps
          />
          <q-btn
            v-if="!edit"
            flat
            no-caps
            label="Создать"
            color="primary"
            v-close-popup
            @click="addFlat"
          />
          <q-btn
            v-if="edit"
            flat
            no-caps
            label="Сохранить"
            color="positive"
            v-close-popup
            @click="updateFlat"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { matDelete, matEdit } from '@quasar/extras/material-icons';

export default {
  name: 'PageIndex',
  created () {
    this.matDelete = matDelete;
    this.matEdit = matEdit;
    const observer = this.$apollo.subscribe({
      // eslint-disable-next-line global-require
      query: require('../graphql/subscriptions/all.gql'),
      variables: {
        offset: 0,
      },
    });
    const vm = this;
    observer.subscribe({
      next ({ data }) {
        vm.loading = false;
        vm.allFlats = data.flats;
        console.log(data);
      },
      error ({ message }) {
        vm.$q.notify({ message });
      },
    });
  },
  data () {
    return {
      allFlats: null,
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        offset: 1,
        rowsPerPage: 20,
        // rowsNumber: xx if getting data from a server
      },
      edit: false,
      loading: true,
      dialog: false,
      flat: {
        id: null,
        title: 'Тестовый объект ',
        square: 500,
        price: 10000000,
      },
      // apollo: {
      //   $subscribe: {
      //     allFlats: {
      //       // eslint-disable-next-line global-require
      //       query: require('../graphql/subscriptions/all.gql'),
      //       result ({ data }) {
      //         console.log(data);
      //         this.allFlats = data.flats;
      //       },
      //     },
      //   },
      // },
      columns: [
        {
          name: 'id',
          required: true,
          label: 'id',
          align: 'left',
          sortable: true,
          field: (row) => row.id,
        },
        {
          name: 'title', align: 'center', label: 'Название', field: (row) => row.title, sortable: true,
        },
        {
          name: 'square', label: 'Площадь (м²)', sortable: true, field: (row) => row.square, format: (val) => `${val} м²`, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
        {
          name: 'price', label: 'Цена (₽)', sortable: true, field: (row) => row.price, format: (val) => `${val} ₽`, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
        {
          name: 'actions', label: 'Действия', sortable: false,
        },
      ],
    };
  },
  methods: {
    async removeItem (id) {
      try {
        this.loading = true;
        await this.$apollo.mutate({
        // eslint-disable-next-line global-require
          mutation: require('../graphql/mutations/remove.gql'),
          variables: {
            id,
          },
          // refetchQueries: [{
          // // eslint-disable-next-line global-require
          //   query: require('../graphql/queries/allFlats.gql'),
          // },
          // ],
        });
        this.loading = false;
        this.$q.notify({
          message: 'Объект успешно удалён',
        });
      } catch ({ message }) {
        this.loading = false;
        this.$q.notify({
          message,
        });
      }
    },
    createFlat () {
      this.edit = false;
      this.openDialog(this.$options.data().flat);
    },
    editFlat (flat) {
      this.edit = true;
      this.openDialog(flat);
    },
    openDialog (flat) {
      Object.assign(this.flat, flat);
      this.dialog = true;
    },
    async addFlat () {
      try {
        this.loading = true;
        await this.$apollo.mutate({
        // eslint-disable-next-line global-require
          mutation: require('../graphql/mutations/add.gql'),
          variables: {
            title: this.flat.title,
            square: this.flat.square,
            price: this.flat.price,
          },
          // refetchQueries: [{
          // // eslint-disable-next-line global-require
          //   query: require('../graphql/queries/allFlats.gql'),
          // },
          // ],
        });
        this.$q.notify({
          message: 'Объект успешно создан',
        });
        this.loading = false;
      } catch ({ message }) {
        this.loading = false;
        this.$q.notify({
          message,
        });
      }
    },
    async updateFlat () {
      try {
        await this.$apollo.mutate({
        // eslint-disable-next-line global-require
          mutation: require('../graphql/mutations/update.gql'),
          variables: {
            id: this.flat.id,
            title: this.flat.title,
            square: this.flat.square,
            price: this.flat.price,
          },
          // refetchQueries: [{
          // // eslint-disable-next-line global-require
          //   query: require('../graphql/queries/allFlats.gql'),
          // },
          // ],
        });
        this.$q.notify({
          message: 'Объект успешно отредактирован',
        });
      } catch ({ message }) {
        this.$q.notify({
          message,
        });
      }
    },
  },
};
</script>
