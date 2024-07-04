<template>
  <div class="container mt-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Cadastros</h1>
      <button class="btn btn-success" @click="addUser">Adicionar Usuário</button>
    </div>
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else>
      <div v-if="alertMessage" class="alert alert-success alert-dismissible fade show" role="alert">
        {{ alertMessage }}
        <button type="button" class="btn-close" aria-label="Close" @click="hideAlert"></button>
      </div>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Data de Nascimento</th>
            <th>CPF</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.dataNascimento }}</td>
            <td>{{ user.cpf }}</td>
            <td>{{ user.email }}</td>
            <td>
              <button class="btn btn-warning btn-sm me-2" @click="editUser(user)">Editar</button>
              <button class="btn btn-danger btn-sm" @click="deleteUser(user.id)">Deletar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <UserForm v-if="showForm" @close="closeForm" @save="fetchUsers" @alert="showAlert" :user="selectedUser" />
  </div>
</template>

<script>
import axios from 'axios';
import UserForm from './UserForm.vue';

export default {
  name: 'UserList',
  components: {
    UserForm,
  },
  data() {
    return {
      showForm: false,
      loading: false,
      users: [],
      selectedUser: null,
      alertMessage: '',
    };
  },
  methods: {
    async fetchUsers() {
      try {
        this.loading = true;
        const response = await axios.get('http://localhost:3000/pessoas');
        this.users = response.data;
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        alert('Erro ao buscar usuários. Por favor, tente novamente mais tarde.');
      } finally {
        this.loading = false;
      }
    },
    async deleteUser(id) {
      try {
        await axios.delete(`http://localhost:3000/pessoas/${id}`);
        this.users = this.users.filter(user => user.id !== id);
        this.showAlert('Usuário(a) deletado com sucesso!');
      } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        alert('Erro ao deletar usuário. Por favor, tente novamente mais tarde.');
      }
    },
    addUser() {
      this.selectedUser = { name: '', dataNascimento: '', cpf: '', email: '' };
      this.showForm = true;
    },
    editUser(user) {
      this.selectedUser = { ...user };
      this.showForm = true;
    },
    closeForm() {
      this.showForm = false;
      this.selectedUser = null;
    },
    showAlert(message) {
      this.alertMessage = message;
      setTimeout(() => {
        this.alertMessage = '';
      }, 3000);
    },
    hideAlert() {
      this.alertMessage = '';
    },
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>

<style scoped>
.container {
  font-family: Arial, sans-serif;
}
</style>
